const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 150);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('assets/app.png');

const iphoneBlue = new THREE.Color(0x1d4f8f);

let phoneModel = null;
const loader = new THREE.GLTFLoader();
loader.load(
  'modelo/iphone_12_pro.glb',
  function (gltf) {
    phoneModel = gltf.scene;
    scene.add(phoneModel);

    phoneModel.traverse((child) => {
      if (child.isMesh) {
        console.log('Nome da face:', child.name);
      }
    });

    phoneModel.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Screen_Wallpaper_0') {
          child.material = new THREE.MeshBasicMaterial({ map: texture });
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: iphoneBlue,
            metalness: 0.5,
            roughness: 0.2
          });
        }
      }
    });

    const box = new THREE.Box3().setFromObject(phoneModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('Tamanho do modelo:', size);

    const center = new THREE.Vector3();
    box.getCenter(center);
    console.log('Centro do modelo:', center);

    phoneModel.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const desiredSize = 100;
    const scale = desiredSize / maxAxis;
    phoneModel.scale.setScalar(scale);

    camera.position.set(0, 0, 150);
    camera.far = 1000;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  },
  undefined,
  function (error) {
    console.error('Erro ao carregar o modelo:', error);
  }
);

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);

  if (phoneModel) {
    phoneModel.rotation.x = mouseY * 0.2;
    phoneModel.rotation.y = mouseX * 0.2;
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
