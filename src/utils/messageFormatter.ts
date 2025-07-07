interface FormattingResult {
  html: string;
  nextIndex: number;
}

export class MessageFormatter {
  private lines: string[];

  constructor(content: string) {
    this.lines = content.split("\n");
  }

  format(): string {
    const result: string[] = [];
    let i = 0;

    while (i < this.lines.length) {
      const line = this.lines[i].trim();

      if (line.startsWith("• ")) {
        const bulletResult = this.formatBulletGroup(i);
        result.push(bulletResult.html);
        i = bulletResult.nextIndex;
      } else if (line.startsWith("- ")) {
        const dashResult = this.formatDashGroup(i);
        result.push(dashResult.html);
        i = dashResult.nextIndex;
      } else if (this.isNumberedItem(line)) {
        const numberedResult = this.formatNumberedGroup(i);
        result.push(numberedResult.html);
        i = numberedResult.nextIndex;
      } else if (line) {
        result.push(`<p class="paragraph">${line}</p>`);
        i++;
      } else {
        i++;
      }
    }

    return this.applyTextFormatting(result.join(""));
  }

  private isNumberedItem(line: string): boolean {
    return /^\d+\.\s/.test(line);
  }

  private formatBulletGroup(startIndex: number): FormattingResult {
    const line = this.lines[startIndex].trim();
    let html = `<div class="bullet-group">`;
    html += `<div class="bullet-item"><span class="bullet-point">•</span><span>${line.substring(
      2
    )}</span></div>`;

    let i = startIndex + 1;
    while (i < this.lines.length) {
      const subResult = this.processBulletSubItems(i);
      if (subResult.html) {
        html += subResult.html;
        i = subResult.nextIndex;
      } else {
        break;
      }
    }

    html += `</div>`;
    return { html, nextIndex: i };
  }

  private formatDashGroup(startIndex: number): FormattingResult {
    const line = this.lines[startIndex].trim();
    let html = `<div class="bullet-group">`;
    html += `<div class="bullet-item"><span class="main-bullet">•</span><span>${line.substring(
      2
    )}</span></div>`;

    let i = startIndex + 1;
    while (i < this.lines.length) {
      const subResult = this.processDashSubItems(i);
      if (subResult.html) {
        html += subResult.html;
        i = subResult.nextIndex;
      } else {
        break;
      }
    }

    html += `</div>`;
    return { html, nextIndex: i };
  }

  private formatNumberedGroup(startIndex: number): FormattingResult {
    const line = this.lines[startIndex].trim();
    let html = `<div class="numbered-group">`;
    html += `<div class="numbered-item">${line}</div>`;

    let i = startIndex + 1;
    while (i < this.lines.length) {
      const subResult = this.processNumberedSubItems(i);
      if (subResult.html) {
        html += subResult.html;
        i = subResult.nextIndex;
      } else {
        break;
      }
    }

    html += `</div>`;
    return { html, nextIndex: i };
  }

  private processBulletSubItems(index: number): FormattingResult {
    const nextLine = this.lines[index].trim();
    const originalLine = this.lines[index];

    if (nextLine.startsWith("- ")) {
      const subItem = nextLine.substring(2);
      return {
        html: `<div class="sub-item"><span class="sub-bullet">-</span><span>${subItem}</span></div>`,
        nextIndex: index + 1,
      };
    }

    if (this.isIndentedBullet(originalLine)) {
      const subItem = nextLine.substring(2);
      return {
        html: `<div class="sub-item"><span class="bullet-point">•</span><span>${subItem}</span></div>`,
        nextIndex: index + 1,
      };
    }

    // Check for numbered items that should be sub-items under bullets (with or without indentation)
    if (this.isNumberedItem(nextLine)) {
      const numberMatch = nextLine.match(/^\d+\./);
      const numberPart = numberMatch ? numberMatch[0] : "";
      const textPart = nextLine.replace(/^\d+\.\s*/, "");
      return {
        html: `<div class="sub-item"><span class="numbered-marker">${numberPart}</span><span>${textPart}</span></div>`,
        nextIndex: index + 1,
      };
    }

    return { html: "", nextIndex: index };
  }

  private processDashSubItems(index: number): FormattingResult {
    const nextLine = this.lines[index].trim();
    const originalLine = this.lines[index];

    const isSubBulletItem = nextLine.startsWith("- ");
    const isIndented = this.isIndentedLine(originalLine);

    if (isSubBulletItem && isIndented) {
      const subItem = nextLine.substring(2);
      return {
        html: `<div class="nested-sub-item"><span class="sub-bullet">-</span><span>${subItem}</span></div>`,
        nextIndex: index + 1,
      };
    }

    if (this.isIndentedBullet(originalLine)) {
      const subItem = nextLine.substring(2);
      return {
        html: `<div class="nested-sub-item"><span class="bullet-point">•</span><span>${subItem}</span></div>`,
        nextIndex: index + 1,
      };
    }

    return { html: "", nextIndex: index };
  }

  private processNumberedSubItems(index: number): FormattingResult {
    const nextLine = this.lines[index].trim();
    const originalLine = this.lines[index];

    if (this.isIndentedDash(originalLine)) {
      const subItem = nextLine.substring(2);
      return {
        html: `<div class="numbered-sub-item"><span class="sub-bullet">-</span><span>${subItem}</span></div>`,
        nextIndex: index + 1,
      };
    }

    if (this.isIndentedBullet(originalLine)) {
      const subItem = nextLine.substring(2);
      return {
        html: `<div class="numbered-sub-item"><span class="bullet-point">•</span><span>${subItem}</span></div>`,
        nextIndex: index + 1,
      };
    }

    return { html: "", nextIndex: index };
  }

  private isIndentedLine(line: string): boolean {
    return line.startsWith("  ") || line.startsWith("\t");
  }

  private isIndentedBullet(line: string): boolean {
    return line.startsWith("  • ") || line.startsWith("\t• ");
  }

  private isIndentedDash(line: string): boolean {
    return line.startsWith("   - ") || line.startsWith("\t- ");
  }

  private applyTextFormatting(html: string): string {
    return html
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
  }
}

export const formatMessageContent = (content: string): string => {
  const formatter = new MessageFormatter(content);
  return formatter.format();
};
