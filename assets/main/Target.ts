import { _decorator, CCString, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass('Target')
export class Target extends Component{
    @property(CCString)
    google_play: string = "";

    @property(CCString)
    appstore: string = "";

    start(){
        this.set_google_play_url(this.google_play)
        this.set_app_store_url(this.appstore)
    }

    download() {
        console.log("download");
        //@ts-ignore
        window.super_html && super_html.download();
    }

    game_end() {
        console.log("game end");
        //@ts-ignore
        window.super_html && super_html.game_end();
    }

    is_hide_download() {
        //@ts-ignore
        if (window.super_html && super_html.is_hide_download) {
            //@ts-ignore
            return super_html.is_hide_download();
        }
        return false
    }

    set_google_play_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.google_play_url = url);
    }

    set_app_store_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.appstore_url = url);
    }


}
export default new Target();