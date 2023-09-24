import {
  MarkdownView,
  Plugin,
} from 'obsidian';




import { ExampleModal } from './Dialog/dialog';
import EditingViewPlugin from './Plugin/EditorExtension';
import { ExampleSettingTab } from './Plugin/settings';
import { MyView, VIEW_TYPE } from './View/view'
import { EditorView } from 'codemirror';



interface ExamplePluginSettings {
  width: string;
  backgroundColor: string;
  isDisplay: boolean;
  commentItmebackgroundColor: string;
  commentItmeColor: string;
  commentItmefontSize: string;

}

const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
  width: "250",
  backgroundColor: "#e3e3e3",//'rgb(246, 248, 250)',
  isDisplay: false,
  commentItmebackgroundColor: "#e4e4e4",
  commentItmeColor: "#000",
  commentItmefontSize: '12px'

};





export default class MyPlugin extends Plugin {

  settings: ExamplePluginSettings;
  current_note: MarkdownView;
  
  
  editorView:EditorView;



  async onload() {

    await this.loadSettings();

   

    this.addSettingTab(new ExampleSettingTab(this.app, this));

    this.registerView(
      VIEW_TYPE,
      (leaf) => new MyView(leaf, this)
    )



    this.addRibbonIcon('quote-glyph', 'Open my view', async (evt) => {
      let view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (view) {
        this.current_note = view
      }
      this.activateView()

    })




    this.registerEditorExtension(EditingViewPlugin(this.app, this));

    this.registerEvent(this.app.workspace.on('active-leaf-change', async (leaf) => {
      let view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (view) {
        this.current_note = view
      }
    }))


    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

    

 

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item
            .setTitle("插入注释 👈")
            .setIcon("document")
            .onClick(async () => {
              new ExampleModal(this.app, (result) => {
                
                const id = Math.random().toString(36).slice(2)
                const contentValue = `<span class='comment-box'><span>📝</span><span class="comment" style="display:none;"  id='comment-id-${id}'>${result}</span></span>`
                editor.replaceSelection(contentValue);
                
          
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

  async onLayoutReady(): Promise<void> {
    await this.activateView()
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE)
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
    );
  }

}


