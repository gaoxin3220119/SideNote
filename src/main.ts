import {
    App,
    Modal,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting
} from 'obsidian';
import { Extension } from "@codemirror/state";


import { examplePlugin } from './ExamplePlugin/ExamplePlugin';
import { ExampleModal } from './Dialog/dialog';








export default class MyPlugin extends Plugin {
    

    

    async onload() {
      

        this.registerEditorExtension(examplePlugin);

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


    onunload() {
        // this.app.workspace.detachLeavesOfType(VIEW_TYPE)
    }

}


