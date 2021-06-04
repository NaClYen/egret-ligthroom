/**
 * 飽和度(Saturation)濾鏡
 */
interface ISatFilterParam {
    /** 飽和度調整值 */
    adjustment: number;
}

class SaturationFilter extends FilterBase<ISatFilterParam> {
    constructor() {
        super();

        this.data.vertFilePath = "./src/filters/saturation/vert.glsl";
        this.data.fragFilePath = "./src/filters/saturation/frag.glsl";

        this.param = {
            adjustment: 0
        };
    }
}
