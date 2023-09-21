import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createApp, App as VueApp } from 'vue';
import App from './App.vue';
import MyPlugin from 'src/main';

export const VIEW_TYPE: string = 'right-notes-view';

export class MyView extends ItemView {

    vueapp: VueApp;
    plugin : MyPlugin

    constructor(leaf: WorkspaceLeaf,plugin:MyPlugin) {
        super(leaf);

        this.plugin = plugin
    }
    getViewType(): string {
        return VIEW_TYPE;
    }
    getDisplayText(): string {
        return VIEW_TYPE;
    }
    getIcon(): string {
        return "dice";
    }
    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
       const mountPoint =  container.createEl("div", {
            cls: "my-plugin-view"
        });
        this.vueapp = createApp(App);
        this.vueapp.config.globalProperties.plugin = this.plugin;
        this.vueapp.config.globalProperties.container = mountPoint;
        this.vueapp.mount('.my-plugin-view');
    }
    async onClose() {
        this.vueapp.unmount();
    }

}