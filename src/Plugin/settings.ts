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

    new Setting(containerEl)
      .setName("宽度")
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
      .setName("背景色")
      .setDesc("笔记区背景色")
      .addText((text) =>
        text
          .setPlaceholder("rgb(246, 248, 250)")
          .setValue(this.plugin.settings.backgroundColor)
          .onChange(async (value) => {
            this.plugin.settings.backgroundColor = value;
            await this.plugin.saveSettings();
          })
      );
  }
}