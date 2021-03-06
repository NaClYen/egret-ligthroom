//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        });

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        };

        //inject the custom material parser
        //?????????????????????????????????
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.runGame().catch((e) => {
            console.log(e);
        });
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        const result = await RES.getResAsync("description_json");
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        } catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise<void>((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //??????????????????????????????,??????????????????????????????????????????????????????
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(
                eui.UIEvent.COMPLETE,
                () => {
                    resolve();
                },
                this
            );
        });
    }

    private textfield: egret.TextField;
    /**
     * ??????????????????
     * Create scene interface
     */
    protected createGameScene(): void {
        let sky = this.createBitmapByName("sun_down_jpeg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;

        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);

        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;

        //#region shader, ???????????????????????????????????????
        this.shaderTest(sky);
        //#endregion
    }
    /**
     * ??????name?????????????????????Bitmap?????????name???????????????resources/resource.json????????????????????????
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * ?????????????????????????????????????????????
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map((text) => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // ??????????????????
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    //#region shader
    vignettingFilterTest(target: egret.DisplayObject) {
        VignettingFilter.applyFilter(target).then((op) => {
            op.param.vignetteCenter = { x: 0.5, y: 0.5 };
            op.param.vignetteColor = ShaderUtil.rgb255ToVec3(240, 198, 185);
            op.param.vignetteStart = 0;
            op.param.vignetteEnd = 0.5;
            op.enable = true;
            window["op"] = op;

            const moveCenter = (xOffset: number, yOffset: number) => {
                op.param.vignetteCenter.x += xOffset;
                op.param.vignetteCenter.y += yOffset;
            };
            const logParam = () => console.log(`op.param: ${JSON.stringify(op.param)}`);
            document.addEventListener("keypress", (ev: KeyboardEvent) => {
                switch (ev.key) {
                    case "w":
                        moveCenter(0, -0.05);
                        logParam();
                        break;
                    case "s":
                        moveCenter(0, 0.05);
                        logParam();
                        break;
                    case "d":
                        moveCenter(0.05, 0);
                        logParam();
                        break;
                    case "a":
                        moveCenter(-0.05, 0);
                        logParam();
                        break;
                    case "r":
                        op.param.vignetteStart += 0.05;
                        logParam();
                        break;
                    case "f":
                        op.param.vignetteStart -= 0.05;
                        logParam();
                        break;
                    case "t":
                        op.param.vignetteEnd += 0.05;
                        logParam();
                        break;
                    case "g":
                        op.param.vignetteEnd -= 0.05;
                        logParam();
                        break;
                }
            });
        });
    }

    async shaderTest(target: egret.DisplayObject) {
        // this.vignettingFilterTest(target);

        // SaturationFilterDebug.link(new SaturationFilter(), target);

        HueFilterDebug.link(new HueFilter(), target);
    }
    //#endregion
}
