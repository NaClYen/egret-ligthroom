abstract class FilterBase<ParamType extends {}> {
    public data: {
        vertFilePath: string;
        fragFilePath: string;
        vertScript: string;
        fragScript: string;
        targets: egret.DisplayObject[];
    };

    private $enable: boolean = false;
    protected rawFilter: egret.CustomFilter;

    /** 濾鏡啟用與否 */
    public get enable() {
        return this.$enable;
    }
    public set enable(val: boolean) {
        this.$enable = val;

        if (val) this.applyFilterToTarget();
        else this.removeFilterFromTarget();
    }

    /** 濾鏡參數, 各分支要覆蓋此變數 */
    public param: ParamType;

    constructor() {
        this.data = {
            vertFilePath: "",
            fragFilePath: "",
            vertScript: "",
            fragScript: "",
            targets: []
        };
    }

    public async loadShader() {
        const loadFileText = async (file: string) => {
            let text: string;
            await fetch(file)
                .then((r) => r.text())
                .then((t) => (text = t))
                .catch((err) => {
                    console.error(err);
                });
            return text;
        };

        const self = this;
        await loadFileText(this.data.vertFilePath).then((t) => (self.data.vertScript = t));
        await loadFileText(this.data.fragFilePath).then((t) => (self.data.fragScript = t));

        // console.log(`vertScript: ${self.data.vertScript}`);
        // console.log(`fragScript: ${self.data.fragScript}`);
    }

    private removeFilterFromTarget() {
        this.data.targets.forEach((target) => {
            if (!target) return;
            if (!target.filters) return;

            const index = target.filters.indexOf(this.rawFilter);
            if (index !== -1) {
                // remove filter
                target.filters.splice(index, 1);

                // filters 不能是空陣列, 因此沒有濾鏡時要整個移除
                if (target.filters.length === 0) {
                    target.filters = undefined;
                }
            }
        });
    }

    private applyFilterToTarget() {
        this.data.targets.forEach((target) => {
            if (!target) return;

            if (target.filters) {
                // 確保沒有重複加入
                const index = target.filters.indexOf(this.rawFilter);
                if (index === -1) {
                    target.filters.push(this.rawFilter);
                }
            } else {
                target.filters = [this.rawFilter];
            }
        });
    }

    /** 動態重載 filter 使用的 shader, 並保留參數. */
    public async reload() {
        const enabled = this.enable;

        // 關閉濾鏡
        this.enable = false;

        await this.loadShader();

        // 產生新的 filter
        this.rawFilter = new egret.CustomFilter(this.data.vertScript, this.data.fragScript, this.param);

        // 恢復設定
        this.enable = enabled;
    }

    public toString() {
        return JSON.stringify({
            data: this.data,
            param: this.param
        });
    }
}
