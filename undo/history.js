
// 命令基类
class Command {
    constructor() {

    }

    execute() {
        console.error('未重写execute方法')
    }
    undo() {
        console.error('未重写undo方法')
    }
}

// 修改元素命令
export class ChangeElementCommand extends Command {

    constructor(el) {
        super();
        this.el = el;
        this._previousText = this.el.innerText;
    }

    execute() {
        console.log('do~')
        this.el.innerText = '替换后的text';
    }
    undo() {
        console.log('undo')
        this.el.innerText = this._previousText;
    }
}


// 创建元素
const InsertElement = {
    text(x, y, size, content='') {
        return draw.text(content).move(x, y).size(size);
    }
}


// 插入元素
export class InsertElementCommand extends Command {

    /**
     * @param {string} type 创建元素类型：path，text
     */
    constructor(type, ...args) {
        super();
        this.el = null;
        this.type = type;
        this.args = args;
    }
    execute() {
        // 这里写创建的方法
        console.log('exec')
        this.el = InsertElement[this.type](...this.args);
    }
    undo() {
        console.log('undo')
        this.el.remove();
    }
}


// 命令管理对象
export const cmdManager = (() => {
    let redoStack = [];        // 重做栈
    let undoStack = [];        // 撤销栈

    return {
        execute(cmd) {
            cmd.execute();                  // 执行execute
            undoStack.push(cmd);       // 入栈 
            redoStack = [];            // 清空 redoStack
        },
    
        undo() {
            if (undoStack.length == 0) {
                alert('can not undo more')
                return;
            }
            const cmd = undoStack.pop();
            cmd.undo();
            redoStack.push(cmd);
        }, 
        
        redo() {
            if (redoStack.length == 0) {
                alert('can not redo more')
                return;
            }
            const cmd = redoStack.pop();
            cmd.execute();
            undoStack.push(cmd);
        },
    }
})();

// export {Command, ChangeElementCommand, CommandManager};