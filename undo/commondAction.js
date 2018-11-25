import { 
    InsertElementCommand,
    cmdManager,
} from './history.js'


// 定义了如何通过参数的形式，创建各种 命令。
// 管理 创建 commond 实例和 其他的一些操作（模仿）
const commondAction = {
    drawText(...args) {
        let cmd = new InsertElementCommand('text', ...args);
        cmdManager.execute(cmd);
    },

    undo() {
        cmdManager.undo();
    },

    redo() {
        cmdManager.redo();
    }
}

// executeCommond 设置为全局方法
window.executeCommond = (cmdName, ...args) => {
    commondAction[cmdName](...args);
}