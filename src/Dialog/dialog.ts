import { App, Modal, Setting, TextAreaComponent } from "obsidian";

export class ExampleModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h6", { text: "您的想法是？" });

    const stylingTemplateSetting = new Setting(contentEl)

    const stylingTemplateContent = new TextAreaComponent(stylingTemplateSetting.controlEl);

    stylingTemplateSetting.settingEl.setAttribute("style", "display: grid; grid-template-columns: 1fr;");

    stylingTemplateContent.inputEl.setAttribute('style', 'width: 100%;  height: 18vh;')

    stylingTemplateContent.onChange(async (value) => {
      this.result = value
    });







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