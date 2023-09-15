import {
    ViewUpdate,
    PluginValue,
    EditorView,
    ViewPlugin,
  } from "@codemirror/view";
  
  class ExamplePlugin implements PluginValue {

    dom


    constructor(view: EditorView) {
      // ...
      this.dom = view.dom.appendChild(document.createElement("div"))
      this.dom.style.cssText =
        "position: absolute; inset-block-start: 2px; inset-inline-end: 5px"
      this.dom.textContent = view.state.doc.length
      
    }
  
    update(update: ViewUpdate) {
      // ...
      console.log('update');
    }
  
    destroy() {
      // ...
    
    }
  }
  
  export const examplePlugin = ViewPlugin.fromClass(ExamplePlugin);