import MyPlugin from "../main";


import { App, PluginSettingTab, Setting } from "obsidian";

export class ExampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'Side Notes 设置' });

    new Setting(containerEl)
      .setName("显示笔记区")
      .setDesc("打开笔记时是否默认显示笔记区")
      .addToggle((s) => {
        s
          .setValue(this.plugin.settings.isDisplay)
          .onChange(async (value) => {
            this.plugin.settings.isDisplay = value;
            await this.plugin.saveSettings();
          })
      });


    new Setting(containerEl)
      .setName("笔记区宽度")
      .setDesc("笔记区宽度")
      .addText((text) =>
        text
          .setPlaceholder("250")
          .setValue(this.plugin.settings.width)
          .onChange(async (value) => {
            this.plugin.settings.width = value;
            await this.plugin.saveSettings();
          })
      );


      new Setting(containerEl)
      .setName("笔记区背景色")
      .setDesc("笔记区背景色")
      .addColorPicker((text) =>
        text
          .setValue(this.plugin.settings.backgroundColor)
          .onChange(async (value) => {
            this.plugin.settings.backgroundColor = value;
            await this.plugin.saveSettings();
          })
      );

      new Setting(containerEl)
      .setName("笔记字体大小")
      .setDesc("笔记字体大小")
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.settings.commentItmefontSize)
          .setValue(this.plugin.settings.commentItmefontSize)
          .onChange(async (value) => {
            this.plugin.settings.commentItmefontSize = value;
            await this.plugin.saveSettings();
          })
      );
      
      new Setting(containerEl)
      .setName("笔记背景色")
      .setDesc("笔记背景色")
      .addColorPicker((text) =>
        text
          .setValue(this.plugin.settings.commentItmebackgroundColor)
          .onChange(async (value) => {
            this.plugin.settings.commentItmebackgroundColor = value;
            await this.plugin.saveSettings();
          })
      );

      new Setting(containerEl)
      .setName("笔记字体颜色")
      .setDesc("笔记字体颜色")
      .addColorPicker((text) =>
        text
          .setValue(this.plugin.settings.commentItmeColor)
          .onChange(async (value) => {
            this.plugin.settings.commentItmeColor = value;
            await this.plugin.saveSettings();
          })
      );
 



    
  }
}