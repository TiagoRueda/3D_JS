const MCR3D = (function () {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 150);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene-container').appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  let mcrModel = null;
  const loader = new THREE.GLTFLoader();

  // Log para verificar o início do carregamento
  console.log('Iniciando o carregamento do modelo...');

  loader.load(
    'modelo/mcr.glb',
    function (gltf) {
      console.log('Modelo carregado com sucesso!');

      mcrModel = gltf.scene;
      scene.add(mcrModel);

      // Log para verificar a estrutura do modelo
      console.log('Modelo carregado:', mcrModel);

      // Verificando os meshes do modelo
      mcrModel.traverse((child) => {
        if (child.isMesh) {
          console.log('Nome da mesh:', child.name);
          child.material = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.5,
            roughness: 0.5
          });
        }
      });

      // Ajustando a escala do modelo
      const box = new THREE.Box3().setFromObject(mcrModel);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log('Tamanho do modelo:', size);

      const maxAxis = Math.max(size.x, size.y, size.z);
      const scale = 100 / maxAxis;
      console.log('Escala ajustada para:', scale);
      mcrModel.scale.setScalar(scale);

      // Centralizando o modelo
      const center = new THREE.Vector3();
      box.getCenter(center);
      console.log('Centro do modelo:', center);
      mcrModel.position.sub(center);

      // Ajustando a posição da câmera
      camera.position.set(0, 0, 150);
      camera.far = 1000;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
    },
    undefined,
    function (error) {
      // Log de erro ao carregar o modelo
      console.error('Erro ao carregar o modelo:', error);
    }
  );

  let mouseX = 0;
  let mouseY = 0;

  // Captura de movimento do mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    console.log(`Posição do mouse: X=${mouseX}, Y=${mouseY}`);
  });

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);

    if (mcrModel) {
      mcrModel.rotation.x = mouseY * 0.2;
      mcrModel.rotation.y = mouseX * 0.2;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Lidar com o redimensionamento da tela
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Redimensionamento da janela realizado');
  });

  return {
    scene: scene,
    camera: camera,
    renderer: renderer
  };
})();