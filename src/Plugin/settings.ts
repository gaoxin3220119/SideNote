import MyPlugin from "../main";


import { App, PluginSettingTab, Setting } from "obsidian";
import { FolderSuggest } from "./suggesters/FolderSuggester";

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

    new Setting(this.containerEl)
      .setName("笔记导出目录")
      .setDesc("笔记导出目录设置 Note export directory settings")
      .addText((cb) => {
        new FolderSuggest(cb.inputEl);
        cb.setPlaceholder("Example: folder1/folder2")
          .setValue(this.plugin.settings.templatesFolder)
          .onChange((new_folder) => {
            this.plugin.settings.templatesFolder = new_folder;
          });
      });

    new Setting(containerEl)

      .setName("显示笔记区")
      .setDesc("打开笔记时是否默认显示笔记区 Display the note area")
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
      .setDesc("笔记区宽度 Note area width (px)")
      .addSlider((text) =>
        text
          .setDynamicTooltip()
          .setLimits(50,1000,10)
          .setValue(this.plugin.settings.width)
          .onChange(async (value) => {
            this.plugin.settings.width = value;
            await this.plugin.saveSettings();
          })
      );



    new Setting(containerEl)
      .setName("笔记区字体大小")
      .setDesc("笔记区字体大小 Notes area font size (px)")
      .addSlider((text) =>
        text
          .setDynamicTooltip()
          .setLimits(10,20,1)
          .setValue(this.plugin.settings.commentItmefontSize)
          .onChange(async (value) => {
            this.plugin.settings.commentItmefontSize = value;
            await this.plugin.saveSettings();
          })
      );

    
  }
}