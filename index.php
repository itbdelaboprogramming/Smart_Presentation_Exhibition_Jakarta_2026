<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Smart Presentation</title>
        <link rel="icon" type="image/x-icon" href="assets/SR_logo_03_red.png">
        <meta charset="UTF-8">
        <!-- <script type="importmap">
            {
                "imports": {
                "three": "https://unpkg.com/three@0.153.0/build/three.module.js"
                }
            } 
        </script> -->
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.2.4/dist/gsap.js"></script>
        <link rel="stylesheet" href="./style/style.css" >
        <script async src="https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js"></script>

        <script type="importmap">
            {
                "imports": {
                "three": "https://unpkg.com/three@0.154.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.154.0/examples/jsm/"
                }
            }
        </script>
    </head>
    <body>
        <div class="home-page">
            <canvas id="myCanvas">    </canvas>
            <!-- line annotation -->
            <!-- <canvas id="lineCanvas" style="position: absolute; top: 0; left: 0;"></canvas> -->
            <div class="container-top-left">
                <div class="pdf_container">
                    <img class="menu-pdf" src="./assets/Pdf.svg">
                    <img class="menu-video" src="./assets/Video.svg">
                </div>
                <div class="page-name-container">
                    <div class="page-name-text">Nakayama VSI Gyropactor</div>
                </div>
            </div>

            <div class="information-container" id="information-container" style="display:none;">
                <div class="information-description">
                    <p class="information-description-title">
                        VSI (Gyropactor) SR
                    </p>
                    <p class="information-description-model-number">SR100C</p>
                    <p class="information-description-description">SR type can accept large material and increase the crushing efficiency at high speed rotating range. <br><br> Two types of crushing chamber are available:<br>1. Anvil type is mainly for crushing.<br>2. Rock bed type is for better shaping.</p>
                    <p class="information-description-description">Features:<br>1. Anvil type can be adjusted both up and down side (reversible).<br>2. Assembled (sectionalized) rotor for easy parts replacement.<br>3. Hydraulic top cover opener for easy maintenance.<br>4. Vibration sensor to detect excessive vibration.<br>5. VSI unit can be loaded into a 40FT container.</p>
                    <p class="information-description-specification">Specifications Unit (mm)</p>
                    <!-- <p class="information-description-specification-detail" >Processing performance depends on quality of material, feeding chunks and particle size. <br><br> This machine’s spec and dimension might be changed without prior-notice for the improvement.</p> -->
                    <img class="information-specification-img" src="./files/dimension_vsi.png" />
                    <img class="information-specification-img" src="./files/dimension_vsi_platform.png" />
                    <img class="information-specification-img" src="./files/specification_2.png" />
                    <img class="information-specification-img" src="./files/specification.png" />
                    <img class="information-specification-img" src="./files/specification_3.png" />
                </div>
                <a class="information-link" target="_blank" href="https://www.ncjpn.com/en/products/crushers/">Crusher Series | Nakayama Iron Works (ncjpn.com)</a>
            </div>

            <div class="catalogue-container-2" id="catalogue-container-2">
                <div>
                    <p class="catalogue-description-title-2">VSI Gyropactor Series</p>
                </div>
                <div class="catalogue-description-2">
                    <div class="catalogue-product-list-2 active" id="model_name_1">
                        <div class="catalogue-product-list-text-2"> VSI Gyropactor </div>
                        <img class="catalogue-image-preview-2" src="./files/SR100C_v1_preview.png" />
                    </div>
                    <div class="catalogue-product-list-2" id="model_name_2">
                        <div class="catalogue-product-list-text-2"> VSI Gyropactor & Platform </div>
                        <img class="catalogue-image-preview-2" src="./files/SRユニット_v1_preview.png" />
                    </div>
                    <div class="catalogue-product-list-2" id="model_name_3">
                        <div class="catalogue-product-list-text-2"> Sand Manufacturing Plant </div>
                        <img class="catalogue-image-preview-2" src="./files/sand_manufacturing_plant.png" />
                    </div>
                </div>
            </div>

            <div class="container-bottom-left-ml2x">
                <div class="sound-expand" style="display:none;">
                    <div class="sound-expand-component">
                        Music
                        <div class="toggle-container">
                            Off
                            <div class="toggle-music"></div>
                            On
                        </div>
                    </div>
                    <div class="sound-expand-component">
                        Voice Over
                        <div class="toggle-container">
                            Off
                            <div class="toggle-speech"></div>
                            On
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-bottom-right-mr2x" >
                <div class="menu-container-blue-lightning-expand" style="display: none">
                    <div class="menu-container-blue-lightning-expand-wrapper">
                        <div class="lightning-component">
                            <div class="lightning-title-2">
                                Lighting:
                                <div class="opsi-container">
                                    <div class="opsi active">
                                        default
                                    </div>
                                    <div class="opsi">
                                        custom
                                    </div>
                                </div>
                            </div>
                            <div class="lightning-component-container custom-lightning" style="display:none;">
                                <div class="slider-group">
                                    Environment Brightness
                                    <div class="slider-container">
                                        <span class="bar">
                                            <span class="fill" id="fill-env"></span>
                                        </span>
                                        <input type="range" min="0" max="2" value="0.5" step="0.1" class="slider" id="slider-env"/>
                                    </div>
                                </div>
                                <div class="slider-group">
                                    Direct Lamp Brightness
                                    <div class="slider-container">
                                        <span class="bar">
                                            <span class="fill" id="fill-lamp"></span>
                                        </span>
                                        <input type="range" min="0" max="40" value="20" step="0.1" class="slider" id="slider-lamp"/>
                                    </div>
                                </div>
                                <div class="slider-group">
                                    Direct Lamp Position
                                    <div class="slider-container">
                                        <span class="bar">
                                            <span class="fill" id="fill-lamp-pos"></span>
                                        </span>
                                        <input type="range" min="0" max="400" value="210" step="1" class="slider" id="slider-lamp-pos"/>
                                    </div>   
                                </div>
                            </div>
                        </div>
                        <div class="lightning-component-center"> 
                            <div class="lightning-title">
                                Enlargement
                            </div>
                            <div class="lightning-component-container">
                                <div class="slider-group">
                                    Zoom
                                    <div class="slider-container">
                                        <span class="bar">
                                            <span class="fill" id="fill-zoom"></span>
                                        </span>
                                        <input type="range" min="0.2" max="20" value="1" step="0.1" class="slider" id="slider-zoom"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-bottom-left">
                <Button class="menu-container-blue-explode" id="explode-button">
                    Explode/Cut
                </Button>
                <div class="menu-container-blue-information">
                    <img src="./assets/Information-Button.png">
                </div>
                <div class="menu-container-blue-sound">
                    <img src="./assets/Sound-Off-Button.png" id="sound-off">
                    <img src="./assets/Sound-On-Button.png" id="sound-on" style="display: none;">
                </div>
                <div class="menu-container-blue-animation">
                    <img src="./assets/Animation-Off-Button.png" id="animation-off">
                    <img src="./assets/Animation-On-Button.png" id="animation-on" style="display: none;">
                </div>
            </div>

            <div class="container-bottom-right">
                <div class="menu-container-blue-album">
                    <img src="./assets/Album-Button.png">
                </div>
                <div class="menu-container-blue-lightning">
                    <img src="./assets/Lightning-Button.png">
                </div>
                <div class="toggle"></div>
            </div>
            

            <div class="container-full-screen-pdf">
                <div class="pdf-pop-up-container" id="pdf-pop-up-container">
                    <embed src="./files/SR_en_ver.2.06_20220523.pdf#scrollbar=0&toolbar=0&view=FitH" type="application/pdf" width="100%" height="100%"/>
                </div>
            </div>
            <div class="container-full-screen-video">
                <div class="pdf-pop-up-container-video" id="pdf-pop-up-container-video">
                    <video id="video" width="100%" height="auto" src="./files/中山鉄工所ジャイロパクタ SRシリーズ.mp4" type="video/mp4" controls></video>
                </div>
            </div>
            <div class="loadingScreenContainer" style="display: none">
                <label for="loadingBar" id='loadingBarLabel'> Loading... </label>
                <progress id='loadingBar' max='100' value='0'></progress>
            </div>

            <script type="module" src="script.js"> </script>
            <script type="module" src="./js/home.js"></script>
        </div>
    </body>
</html>
