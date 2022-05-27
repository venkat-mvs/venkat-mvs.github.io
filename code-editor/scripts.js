/*
 Feature

 1) load selected language and typed code
    even on refresh or page load we can retain the state.
*/


const DEFAULT_LANG = "python"


const CodeEditor = {
    RemoteLib:{
        base : "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.55.0/"
    },

    languages : {
        python:{
            uri:"mode/python/python.min.js",
            mode:"python",
            default:"print('hello world')"
        },
        javascript:{
            uri:"mode/javascript/javascript.js",
            mode:"text/javascript",
            default:"(function(){\n\tconsole.log('hello world')\n})()"
        },
        "c++":{
            uri:"mode/clike/clike.js",
            mode:"text/x-c++src",
            default:"#include<iostream>\n\nint main(){\n\tcout<<\"Hello world\";\n}"
        },
        c:{
            uri:"mode/clike/clike.js",
            mode:"text/x-csrc",
            default:"#include<stdio.h>\n\nint main(){\n\tprintf(\"Hello world\");\n}"
        },
        java:{
            uri:"mode/clike/clike.js",
            mode:"text/x-java",
            default:"class HelloWorld{\n\tpublic static void main(String[] args){\n\t\tSystem.out.println(\"Hello world\");\n\t}\n}"
        },
        css:{
            uri:"mode/css/css.js",
            mode:"css",
            default:"body{\n\tmargin:0px;\n\tpadding:0px;\n}"
        }
    },

    addLanguage : function(language, mode, link, default_code){
        this.languages[language] = {
            mode: mode,
            uri: link,
            default: default_code
        }
    },

    getLang : function(lang){
        var language = this.languages[lang];
        if(!language) return null;
        var link = this.RemoteLib.base + language.uri;
        return [link,
                language.mode,
                language.default];
    },

    onLoad : async function(){
        const p_editor = this;

        // setInterval to save data
        setInterval(() => p_editor.onClose(),1000);
        

        // configure editor
        this.editor.setSize("100%","100%");

        // ------ Load from session

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                // Prevent the Save dialog to open
                e.preventDefault();
                // Place your code here
                let confirmed = confirm("Do you want to save the file?")
                console.log(confirmed);
                if(confirmed){
                    let code = p_editor.editor.getValue();
                    let filename = prompt("File Name you want to save as",Session.Filename || "codetext.txt")
                    console.log(filename); 
                    if(filename){ 
                        confirmed = confirm(`Do you want to save as ${filename}?`)
                        if(confirmed){
                            download(filename, code);
                            Session.Filename = filename;
                        }
                    } 
                }   
            }
          });
        
        // language
        let selectedLanguage = Session.language || DEFAULT_LANG;
        let [link, mode, default_code] = this.getLang(selectedLanguage);
        this.changeOptions(selectedOption = selectedLanguage);
        this.SelectLanguage(selectedLanguage);

        // code
        let code = Session.code || default_code;
        if(code) this.editor.setValue(code);

        
        // cusror
        this.editor.focus();
        let cursorPosition = Session.cursorPosition;
        if(cursorPosition){
            let pos = JSON.parse(Session.cursorPosition)
            this.editor.setCursor(pos);
        }

        // history
        let codeHistory = Session.codeHistory;
        let parsedHistory = (codeHistory)?JSON.parse(codeHistory): null;
        if(parsedHistory){
            this.editor.clearHistory();
            this.editor.setHistory(parsedHistory);
        }
    },

    changeOptions : function(selectedOption){
        var selectOption = document.getElementById('language');
        selectOption.childNodes = [];
        for(var lang in this.languages){
            var option = document.createElement("option");
            option.value = lang;
            option.innerText = lang;
            if(lang == selectedOption) option.selected = true;
            selectOption.appendChild(option);
        }
    },

    editor : CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        indentWithTabs:true,
        smartIndent:true,
        tabSize:5,
        indentUnit:5,
        matchBrackets: true,
        styleActiveLine: true,
        autofocus: true,
        foldGutter: true,
        lineWrapping:true,
        value:'None',
        theme:"vscode-dark",
        mode:"plain"
    }),

    changeLanguage : function(mode){
        this.editor.setOption("mode", mode);
        console.warn("Changed Editor Language("+mode+") "+(new Date()));
    },

    createScriptNode : function(link, onload){
        var jsnode = document.createElement("script");
        
        jsnode.type = "text/javascript";
        jsnode.src = link;
        jsnode.onload = onload;

        return jsnode;
    },

    onClose : function(){
        Session.code = this.editor.getValue();
        Session.codeHistory = JSON.stringify(this.editor.getHistory());
        Session.cursorPosition = JSON.stringify(this.editor.getCursor());

        console.info("Saved the data!")

        return null;
    },

    SelectLanguage : function(lang){
        if(!lang) return;
        Session.language = lang;

        var [link, mode, default_code]  = this.getLang(lang);
        
        if(! document.querySelector("[language='"+lang+"']")){
            var jsnode = this.createScriptNode(link, () => this.changeLanguage(mode, default_code));
            jsnode.setAttribute("language", lang);
            console.warn("Adding "+ lang +" extension");
            document.body.appendChild(jsnode);
        }else{
            console.warn("Found "+ lang +" extension");
            this.changeLanguage(mode);
        }
    }
}

DEBUG = localStorage.getItem("DEBUG")

window.onload = async () => await CodeEditor.onLoad();

(function(){
    if(DEBUG)
    window['console']['warn'] = console.log
    else
    window['console']['warn'] = ()=> '';
})();

