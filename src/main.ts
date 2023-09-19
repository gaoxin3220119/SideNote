import {
  App,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting
} from 'obsidian';
import { Extension } from "@codemirror/state";


import { examplePlugin } from './ExamplePlugin/ExamplePlugin';
import { ExampleModal } from './Dialog/dialog';
import EditingViewPlugin from './Plugin/EditorExtension';
import { ExampleSettingTab } from './Plugin/settings';



interface ExamplePluginSettings {
  width: string;
  backgroundColor: string
}

const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
  width: "250",
  backgroundColor:'rgb(246, 248, 250)'
};





export default class MyPlugin extends Plugin {

  settings: ExamplePluginSettings;


  async onload() {

    await this.loadSettings();

    this.addSettingTab(new ExampleSettingTab(this.app, this));

    this.registerEditorExtension(EditingViewPlugin(this.app,this));

  
  
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item
            .setTitle("插入注释 👈")
            .setIcon("document")
            .onClick(async () => {
              new ExampleModal(this.app, (result) => {
                const id = Math.random().toString(36).slice(2)
                editor.replaceSelection(`<span class='comment-box'><span>📝</span><span class="comment" style="display:none;"  id='comment-id-${id}'>${result}</span></span>`);
              }).open()

            });
        });
      })
    );

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    // this.app.workspace.detachLeavesOfType(VIEW_TYPE)
  }

}


