import { App, Modal, Setting, TextAreaComponent } from "obsidian";





export class ConfirmModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h6", { text: "文件已经存在，是否替换？" });


    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("确定")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
          }));
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}