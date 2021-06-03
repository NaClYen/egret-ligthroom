type RgbType = { r: number; g: number; b: number; a: number };
class ShaderUtil {
    /** 0.0~1.0 表示的 rgb to vec3 */
    public static rgb01ToVec3(r: number, g: number, b: number) {
        return { x: r, y: g, z: b };
    }
    /** 0~255 表示的 rgb to vec3 */
    public static rgb255ToVec3(r: number, g: number, b: number) {
        return { x: r / 255, y: g / 255, z: b / 255 };
    }
}
