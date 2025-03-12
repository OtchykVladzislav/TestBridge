import { _decorator, Component, Widget, Enum, view, UITransform } from 'cc';
const { ccclass, property } = _decorator;

enum HorizontalAlignment {
    NONE,
    LEFT,
    CENTER,
    RIGHT,
}

enum VerticalAlignment {
    NONE,
    TOP,
    MIDDLE,
    BOTTOM,
}

@ccclass('ScreenEdgePositioner')
export class ScreenEdgePositioner extends Component {
    @property(Widget)
    targetWidget: Widget = null!;

    // Настройки для портретной ориентации
    @property({ type: Enum(HorizontalAlignment) })
    portraitHorizontal: HorizontalAlignment = HorizontalAlignment.NONE;
    @property({ type: Enum(VerticalAlignment) })
    portraitVertical: VerticalAlignment = VerticalAlignment.NONE;
    @property portraitMarginLeft: number = 0;
    @property portraitMarginRight: number = 0;
    @property portraitMarginTop: number = 0;
    @property portraitMarginBottom: number = 0;

    // Настройки для ландшафтной ориентации
    @property({ type: Enum(HorizontalAlignment) })
    landscapeHorizontal: HorizontalAlignment = HorizontalAlignment.NONE;
    @property({ type: Enum(VerticalAlignment) })
    landscapeVertical: VerticalAlignment = VerticalAlignment.NONE;
    @property landscapeMarginLeft: number = 0;
    @property landscapeMarginRight: number = 0;
    @property landscapeMarginTop: number = 0;
    @property landscapeMarginBottom: number = 0;

    private aspectRatio: number = 0;

    onLoad() {
        view.on('canvas-resize', this.updateLayout, this);
    }

    start() {
        
        this.updateLayout();
    }

    updateLayout() {
        if (!this.targetWidget) return;

        const frameSize = view.getFrameSize();

        const isPortrait = frameSize.height > frameSize.width;
        
        const multiplier : any =  (isPortrait ? frameSize.height/frameSize.width : frameSize.width/frameSize.height)

        this.aspectRatio = multiplier.toFixed(2) / 2.17

        const settings = isPortrait 
            ? this.getPortraitSettings() 
            : this.getLandscapeSettings();
    
        this.applySettings(settings);
        this.forceWidgetUpdate();
    }

    private getPortraitSettings() {
        return {
            horizontal: this.portraitHorizontal,
            vertical: this.portraitVertical,
            left: this.portraitMarginLeft,
            right: this.portraitMarginRight,
            top: this.portraitMarginTop,
            bottom: this.portraitMarginBottom
        };
    }

    private getLandscapeSettings() {
        return {
            horizontal: this.landscapeHorizontal,
            vertical: this.landscapeVertical,
            left: this.landscapeMarginLeft,
            right: this.landscapeMarginRight,
            top: this.landscapeMarginTop,
            bottom: this.landscapeMarginBottom
        };
    }

    private applySettings(settings: any) {
        this.targetWidget.isAlignLeft = settings.horizontal === HorizontalAlignment.LEFT;
        this.targetWidget.isAlignRight = settings.horizontal === HorizontalAlignment.RIGHT;
        this.targetWidget.isAlignHorizontalCenter = settings.horizontal === HorizontalAlignment.CENTER;

        this.targetWidget.isAlignTop = settings.vertical === VerticalAlignment.TOP;
        this.targetWidget.isAlignBottom = settings.vertical === VerticalAlignment.BOTTOM;
        this.targetWidget.isAlignVerticalCenter = settings.vertical === VerticalAlignment.MIDDLE;

        this.targetWidget.left = settings.left * this.aspectRatio;
        this.targetWidget.right = settings.right * this.aspectRatio;
        this.targetWidget.top = settings.top * this.aspectRatio;
        this.targetWidget.bottom = settings.bottom * this.aspectRatio;
    }

    private forceWidgetUpdate() {
        // Обновляем размеры через UITransform
        const uiTransform = this.targetWidget.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.width += 0.001;
            uiTransform.width -= 0.001;
        }
        
        this.targetWidget.updateAlignment();
    }

    onDestroy() {
        view.off('canvas-resize', this.updateLayout, this);
    }
}