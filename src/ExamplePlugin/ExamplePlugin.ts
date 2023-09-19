import {
  ViewUpdate,
  PluginValue,
  EditorView,
  ViewPlugin,
} from "@codemirror/view";






class ExamplePlugin implements PluginValue {


  dom: HTMLElement;
  fixed: boolean;
  prevViewport: { from: number, to: number };

  constructor(view: EditorView) {

    this.prevViewport = view.viewport;
    this.dom = document.createElement('div');
    this.dom.className = 'cm-gutters';
    this.dom.setAttribute('style', 'background-color:rgb(246, 248, 250)!important;width:250px;margin-right: 30px');
    this.dom.setAttribute("id", "right-gutters")
    
    this.dom.style.minHeight = view.contentHeight + 'px';



    view.scrollDOM.insertAfter(this.dom, view.contentDOM.nextSibling);




  }




  setCommnet(view: EditorView) {


    const _get_gutter = view.dom.querySelector('#right-gutters')
    if (_get_gutter) {

      _get_gutter.empty()

      const findComment = view.contentDOM.querySelectorAll(".comment")


      if(findComment.length===0){

         const findStyle = view.contentDOM.querySelectorAll(".cm-line")

         findStyle.forEach($el=>{

          let getStyles =  $el.getAttribute('style')


          if(getStyles){
            if(getStyles.endsWith('top:0px')){
              $el.removeAttribute('style')
            };
          }

         })

      }
      
      
      findComment.forEach(element => {
        if (element) {

          const comments = document.createElement('div')
          comments.style.top = element.parentElement.parentElement.parentElement.offsetTop + 'px'
          comments.style.position = 'absolute'
          comments.style.zIndex = '99'
          comments.style.cursor = 'pointer'
          comments.style.whiteSpace= 'pre-wrap'  
          comments.addClass('rightComments')


          comments.innerHTML = element.innerHTML
          
          _get_gutter.append(comments)


          comments.onclick = (e) => {

            comments.setAttribute('contenteditable', 'plaintext-only')

            

            comments.style.cursor = 'text'

            comments.style.border = '1px solid #00f'
          }


       


          comments.onblur = (e) => {

            const node = view.contentDOM.querySelector('#' + element.getAttribute('id'))

            const newText = (e.target as HTMLElement).innerText

            const { state } = view;

            const position = view.posAtDOM(node);

            const line = state.doc.lineAt(position);

            const Exp = RegExp("(" + element.getAttribute('id') + "'>)([\\s\\S]*?)(<\/span>)", "g")

            const test = line.text.replace(Exp, '$1' + newText + '$3')

            
            


            view.dispatch({ changes: { from: line.from, to: line.to, insert: test.replace(/\n/g, "<br>"), } })

          
            
          
          }





         
          


          if(comments.offsetHeight+5 >= element.parentElement.parentElement.parentElement.offsetHeight){

            element.parentElement.parentElement.parentElement.setAttribute('style',`height:${comments.offsetHeight + 5}px;top:0px`)
            

          }else{

            element.parentElement.parentElement.parentElement.removeAttribute('style')

          }
         
         


        }


      });


    }

  }

  update(update: ViewUpdate) {


    this.dom.style.minHeight = update.view.contentHeight + 'px';

    this.setCommnet(update.view)

    

  }

  destroy() {
    this.dom.remove();
  }
}

export const examplePlugin = ViewPlugin.fromClass(ExamplePlugin);