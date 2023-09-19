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








export default class MyPlugin extends Plugin {




  async onload() {

    let isWork = true

    this.registerEditorExtension(examplePlugin);

    const view = this.app.workspace.getActiveViewOfType(MarkdownView)

    const rightGutters=view.contentEl.querySelector('#right-gutters')

    const item = this.addStatusBarItem();
    item.createEl("span", { text: "📝" });
    item.style.cursor='pointer'
    item.onclick=(e)=>{
      console.log(isWork);
      if(isWork){
        isWork = false
        rightGutters.setAttribute('style','display:block')
        rightGutters.setAttribute('style', 'background-color:rgb(246, 248, 250)!important;width:250px;margin-right: 30px');
      }else{
        isWork = true
        rightGutters.setAttribute('style','display:none')
        
      }
      
    }

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


