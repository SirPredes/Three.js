import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


class SimonDevGLSLCourse {
  constructor() {
  }

  async initialize() {
    this.threejs_ = new THREE.WebGLRenderer();
    document.body.appendChild(this.threejs_.domElement);

    window.addEventListener('resize', () => {
      this.onWindowResize_();
    }, false);

    this.scene_ = new THREE.Scene();
    this.scene_.background = new THREE.Color(0.7, 0.8, 1.0);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 0.1;
    const far = 10000.0;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(10, 5, 5);

    const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(1, 1, 1);
    light.lookAt(0, 0, 0);
    this.scene_.add(light);

    const controls = new OrbitControls(this.camera_, this.threejs_.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    this.materials_ = [];

    await this.setupProject_();

    this.previousRAF_ = null;
    this.onWindowResize_();
    this.raf_();
  }

  CreateGeometry_(segments){
    const VERTICES = (segments + 1) * 2;
    const indices = [];

    for(let i = 0; i < segments; i++){
      const vi = i * 2;
      indices[i * 12 + 0] = vi + 0;
      indices[i * 12 + 1] = vi + 1;
      indices[i * 12 + 2] = vi + 2;
      
      indices[i * 12 + 3] = vi + 2;
      indices[i * 12 + 4] = vi + 1;
      indices[i * 12 + 5] = vi + 3;

      const fi = VERTICES + vi;
      indices[i * 12 + 6] = fi + 2;
      indices[i * 12 + 7] = fi + 1;
      indices[i * 12 + 8] = fi + 0;
      
      indices[i * 12 + 9] = fi + 3;
      indices[i * 12 + 10] = fi + 1;
      indices[i * 12 + 11] = fi + 2;
    }

    const NUM_GRASS = 1;
    const geo = new THREE.InstancedBufferGeometry();
    geo.setIndex(indices)
    geo.boundingSphere = new THREE.Sphere(
        new THREE.Vector3(0, 0, 0),
      1000);

    return geo;
  }

  async setupProject_() {
    const sky = await fetch('./shaders/sky.glsl');
    const vshSky = await fetch('./shaders/sky-vertex-shader.glsl');
    const fshSky = await fetch('./shaders/sky-fragment-shader.glsl');
    const vshGround = await fetch('./shaders/ground-vertex-shader.glsl');
    const fshGround = await fetch('./shaders/ground-fragment-shader.glsl');

    const skyText = await sky.text();
    const vshSkyText = await vshSky.text();
    const fshSkyText = await fshSky.text();
    const vshGroundText = await vshGround.text();
    const fshGroundText = await fshGround.text();

    const diffuseTexture = new THREE.TextureLoader().load('./textures/grid.png');
    diffuseTexture.wrapS = THREE.RepeatWrapping;
    diffuseTexture.wrapT = THREE.RepeatWrapping;

    // Make ground
    const groundMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(1, 1) },
        diffuseTexture: { value: diffuseTexture },
      },
      vertexShader: vshGroundText,
      fragmentShader: fshGroundText
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 512, 512);
    const plane = new THREE.Mesh(geometry, groundMat);
    plane.rotateX(-Math.PI / 2);
    plane.scale.setScalar(10);
    this.scene_.add(plane);
    this.materials_.push(groundMat);

    // Make sky
    const skyGeo = new THREE.SphereGeometry(5000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader: vshSkyText,
        fragmentShader: skyText + fshSkyText,
        side: THREE.BackSide
      });
  

    this.sky_ = new THREE.Mesh(skyGeo, skyMat);
    this.sky_.castShadow = false;
    this.sky_.receiveShadow = false;
    this.scene_.add(this.sky_);
    this.materials_.push(skyMat);


    this.totalTime_ = 0;
    this.onWindowResize_();
  }

  onWindowResize_() {
    const dpr = window.devicePixelRatio;
    const canvas = this.threejs_.domElement;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    this.threejs_.setSize(w * dpr, h * dpr, false);
    for (let m of this.materials_) {
      m.uniforms.resolution.value.set(w * dpr, h * dpr);
    }
  }

  raf_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.step_(t - this.previousRAF_);
      this.threejs_.render(this.scene_, this.camera_);
      this.raf_();
      this.previousRAF_ = t;
    });
  }

  step_(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    this.totalTime_ += timeElapsedS;

    for (let m of this.materials_) {
      m.uniforms.time.value = this.totalTime_;
    }
  }
}


let APP_ = null;

window.addEventListener('DOMContentLoaded', async () => {
  APP_ = new SimonDevGLSLCourse();
  await APP_.initialize();
});
