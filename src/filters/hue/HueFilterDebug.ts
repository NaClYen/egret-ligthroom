/** 飽和度濾鏡測試用類別 */
class HueFilterDebug {
    public static async link(op: HueFilter, target: egret.DisplayObject) {
        await op.reload();
        op.data.targets.push(target);

        op.param.adjustment = 0.2;
        window["op"] = op;

        const logParam = () => console.log(`op.param: ${JSON.stringify(op.param)}`);
        document.addEventListener("keypress", (ev: KeyboardEvent) => {
            switch (ev.key) {
                case "z":
                    op.enable = !op.enable;
                    console.log(op.enable ? "enable filter" : "disable filter");
                    break;
                case "w":
                    op.param.adjustment += 0.05;
                    logParam();
                    break;
                case "s":
                    op.param.adjustment -= 0.05;
                    logParam();
                    break;
                case "p":
                    op.reload();
                    break;
            }
        });
    }
}
