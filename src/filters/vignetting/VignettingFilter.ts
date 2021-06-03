/**
 * 暈影濾鏡
 */
class VignettingFilter {
    public static async applyFilter(target: egret.DisplayObject) {
        const vertFilePath = "./src/filters/vignetting/vert.glsl";
        const fragFilePath = "./src/filters/vignetting/frag.glsl";

        const loadFileText = (file: string, cb: (text: string) => void) => {
            return fetch(file)
                .then((r) => r.text())
                .then(cb);
        };

        let vertScript: string;
        let fragScript: string;

        // load scripts
        const loadSahder = async () => {
            await loadFileText(vertFilePath, (t) => (vertScript = t));
            await loadFileText(fragFilePath, (t) => (fragScript = t));
        };

        await loadSahder();

        // console.log(`vertScript: ${vertScript}`);
        // console.log(`fragScript: ${fragScript}`);

        // 產生自製濾鏡
        let filter = new egret.CustomFilter(vertScript, fragScript);

        // 操作用物件
        const operator = {
            // 濾鏡開關
            get enable() {
                return target.filters && target.filters.length > 0;
            },
            set enable(val: boolean) {
                if (val) {
                    target.filters = [filter];
                } else {
                    target.filters = undefined;
                }
            },

            // 可控參數
            get param() {
                return filter.uniforms as {
                    /** 暈影中心點 */
                    vignetteCenter: { x: number; y: number };
                    /** 暈影顏色 */
                    vignetteColor: { x: number; y: number; z: number };
                    /** 暈影起始值(視覺上內圍) */
                    vignetteStart: number;
                    /** 暈影終點值(視覺上外圍) */
                    vignetteEnd: number;
                };
            },

            // 重載 shader
            async reload() {
                const enabled = operator.enable;

                // 關閉濾鏡
                operator.enable = false;

                await loadSahder();

                filter = new egret.CustomFilter(vertScript, fragScript, filter.uniforms);

                // 恢復設定
                operator.enable = enabled;
            }
        };

        return operator;
    }
}
