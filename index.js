class PyModule {
    constructor(addon, pModule) {
        this._addon = addon;
        this._pModule = pModule;
    }

    /**
     * sync call python func
     * @param {*} func 
     * @param {*} args 
     * @returns 
     */
    callSync = (func, args) => {
        return this._addon.callSync(this._pModule, func, args);
    }

    /**
     * async call python func
     * @param {*} func 
     * @param {*} args 
     * @param {*} okCallBack callback on ok.
     * @param {*} errorCallBack callback on error.
     */
    call = (func, args, okCallBack = null, errorCallBack = null) => {
        this._addon.call(this._pModule, func, args, okCallBack, errorCallBack);
    }
}

class PyRunner {
    constructor() {
        /* pyrunner init config */
        // node-pyrunner install in ./node_modules/node-pyrunner
        let appHome = __dirname.replace('\\node_modules\\node-pyrunner', '').replace('/node_modules/node-pyrunner', '');
        this.config = {
            "python_version": "3.10.10",
            "python_home": `${appHome}/python/${process.platform}/${process.arch}/3.10.10`,
            "program_name": process.platform == 'win32' ? 'python' : 'python3',
            "base_prefix": "",
            "base_exec_prefix": "",
            "base_executable": "",
            "prefix": `${appHome}/pyscript/venv`,
            "exec_prefix": `${appHome}/pyscript/venv`,
            "executable": `${appHome}/pyscript/venv/Scripts/python${process.platform == 'win32' ? '.exe' : ''}`,
            "pythonpath_env": `${appHome}/pyscript/venv/Lib/site-packages`,
            "module_search_paths": [__dirname, appHome, `${appHome}/pyscript`],
            "encoding": "utf-8"
        }
        /* pyrunner addon object */
        this._addon = require(`./addons/${this.config['python_version']}/${process.platform}/${process.arch}/pyrunner`);
        /* init state */
        this._isInit = false;
    }

    /**
     * pyrunner init method
     * @returns 
     */
    init = () => {
        this.config['base_prefix'] = this.config['base_prefix'] == "" ? this.config['python_home'] : this.config['base_prefix'];
        this.config['base_exec_prefix'] = this.config['base_exec_prefix'] == "" ? this.config['python_home'] : this.config['base_exec_prefix'];
        this.config['base_executable'] = this.config['base_executable'] == "" ? this.config['python_home'] : this.config['base_executable'];
        this._isInit = this._addon.init(this.config);
        return this._isInit;
    }

    /**
     * sync run python script
     * @param {*} pyScript 
     * @returns 
     */
    runScriptSync = (pyScript) => {
        if (this._isInit) {
            this._addon.runScriptSync(pyScript);
            return true;
        }
        return false;
    }

    /**
     * async run python script
     * @param {*} pyScript python script.
     * @param {*} okCallBack callback on ok.
     * @param {*} errorCallBack callback on error
     * @returns 
     */
    runScript = (pyScript, okCallBack = null, errorCallBack = null) => {
        if (this._isInit) {
            this._addon.runScript(pyScript, okCallBack, errorCallBack);
            return true;
        }
        return false;
    }

    /**
     * import python module object
     * @param {*} pModule 
     * @returns 
     */
    import = (pModule) => {
        if (this._isInit) {
            let pyModule = new PyModule(this._addon, pModule);
            return pyModule;
        }
    }

    /**
     * release pyrunner
     * @returns 
     */
    release = () => {
        if (this._isInit) {
            this._addon.release();
            return true;
        }
        return false;
    }

    /**
     * print about pyrunner
     * @returns 
     */
    about = () => {
        if (this._isInit) {
            this._addon.about();
            return true;
        }
        return false;
    }

    /**
     * get node-pyrunner version
     * @returns 
     */
    version = () => {
        return '1.0.5';
    }

}

module.exports = new PyRunner()