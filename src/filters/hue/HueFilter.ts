/**
 * 色相(Hue)濾鏡
 */
interface IHueFilterParam {
    /** 色相角度偏移值 */
    adjustment: number;
}

class HueFilter extends FilterBase<IHueFilterParam> {
    constructor() {
        super();

        this.data.vertFilePath = "./src/filters/hue/vert.glsl";
        this.data.fragFilePath = "./src/filters/hue/frag.glsl";

        this.param = {
            adjustment: 0
        };
    }
}
