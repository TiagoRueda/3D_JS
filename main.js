const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 150); // Posiciona a câmera mais distante para ver o modelo grande
camera.lookAt(0, 0, 0); // Garante que a câmera olhe para o centro da cena

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Luz
const light = new THREE.AmbientLight(0xffffff, 1); // Luz branca suave
scene.add(light);

// Carregar a textura da imagem (app.png)
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('app.png'); // Caminho da imagem (certifique-se que está no lugar certo)

// Cor Azul do iPhone 12 (Pacific Blue)
const iphoneBlue = new THREE.Color(0x1d4f8f); // Cor Azul - Pacific Blue do iPhone 12

// Modelo
let phoneModel = null;
const loader = new THREE.GLTFLoader();
loader.load(
  'modelo/iphone_12_pro.glb',
  function (gltf) {
    phoneModel = gltf.scene;
    scene.add(phoneModel);

    // Inspecionar os nomes das faces (ajustar conforme necessário)
    phoneModel.traverse((child) => {
      if (child.isMesh) {
        console.log('Nome da face:', child.name); // Verifique os nomes no console
      }
    });

    // Agora aplicamos a textura na face correta
    phoneModel.traverse((child) => {
      if (child.isMesh) {
        // Aplica a textura na face da tela (Screen_Wallpaper_0)
        if (child.name === 'Screen_Wallpaper_0') { // Ajuste o nome conforme necessário
          child.material = new THREE.MeshBasicMaterial({ map: texture }); // Aplica a textura
        } else {
          // Para as outras faces, aplica a cor azul do iPhone 12
          child.material = new THREE.MeshStandardMaterial({
            color: iphoneBlue, // Cor azul
            metalness: 0.5,    // Dá um efeito de brilho metálico
            roughness: 0.2     // Superfície um pouco mais suave
          });
        }
      }
    });

    // Diagnóstico de bounding box para centralizar e escalar o modelo
    const box = new THREE.Box3().setFromObject(phoneModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('Tamanho do modelo:', size);

    const center = new THREE.Vector3();
    box.getCenter(center);
    console.log('Centro do modelo:', center);

    // Centraliza o modelo
    phoneModel.position.sub(center);

    // Ajusta a escala do modelo para caber na tela
    const maxAxis = Math.max(size.x, size.y, size.z);
    const desiredSize = 100; // Aumentado para um tamanho melhor
    const scale = desiredSize / maxAxis;
    phoneModel.scale.setScalar(scale);

    // Atualiza a câmera para ver o modelo inteiro
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

// Controle do mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animação
function animate() {
  requestAnimationFrame(animate);

  if (phoneModel) {
    phoneModel.rotation.x = mouseY * 0.2;
    phoneModel.rotation.y = mouseX * 0.2;
  }

  renderer.render(scene, camera);
}
animate();

// Responsivo
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
