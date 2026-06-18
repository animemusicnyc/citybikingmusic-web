import { useEffect, useRef } from 'preact/hooks';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { asset } from '../lib/common';
import { startTiltSource, stopTiltSource, subscribeTilt } from '../lib/tilt';

export default function CityScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const focusRef = useRef(new THREE.Vector3(0, 0.25, 0));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let model: THREE.Object3D | null = null;
    let bikeObj: THREE.Object3D | null = null;
    let cityMaterial: THREE.MeshBasicMaterial | null = null;
    let bikeMaterial: THREE.MeshBasicMaterial | null = null;
    let subwayMaterial: THREE.MeshBasicMaterial | null = null;
    let whiteMaterial: THREE.MeshBasicMaterial | null = null;
    let outlineMaterial: THREE.LineBasicMaterial | null = null;
    let viewHeight = 2.8;
    const focus = focusRef.current;
    const outlineGeometries: THREE.EdgesGeometry[] = [];
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030303);

    const startOffset = new THREE.Vector2(0, 0);
    const targetOffset = startOffset.clone();
    const currentOffset = startOffset.clone();

    // Isometric-ish camera settings.
    // Camera looks at the focus from a fixed diagonal; we orbit around it.
    const orbitRadius = 12;
    const orbitHeight = 9;
    const orbitSpeed = 0.0004;
    let orbitAngle = Math.PI / 1.5;
    const targetOrbitAngle = { value: orbitAngle };
    const currentOrbitAngle = { value: orbitAngle };
    const baseElevation = Math.PI / 6;
    const elevationAmplitude = 0.08;
    let elevationPhase = 0;

    const pointerInfluence = { azimuth: 0, elevation: 0 };
    const targetPointerInfluence = { azimuth: 0, elevation: 0 };
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.zoom = 0.5;
    cameraRef.current = camera;

    const setRendererSize = () => {
      if (disposed || !rendererRef.current) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      const aspect = w / h;
      camera.left = (viewHeight * aspect) / -2;
      camera.right = (viewHeight * aspect) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = viewHeight / -2;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h, false);
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x030303, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(4, 7, 5);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xff3043, 0.32);
    fill.position.set(-4, 2.5, -3);
    scene.add(fill);

    const positionCamera = () => {
      const c = cameraRef.current;
      if (!c) return;
      currentOffset.lerp(targetOffset, 0.08);
      pointerInfluence.azimuth +=
        (targetPointerInfluence.azimuth - pointerInfluence.azimuth) * 0.08;
      pointerInfluence.elevation +=
        (targetPointerInfluence.elevation - pointerInfluence.elevation) * 0.08;

      const elevation =
        baseElevation +
        Math.sin(elevationPhase) * elevationAmplitude +
        pointerInfluence.elevation;
      const clampedElevation = THREE.MathUtils.clamp(elevation, 0.05, Math.PI / 2 - 0.05);
      const y = Math.sin(clampedElevation) * orbitHeight;
      const horizontalRadius = Math.cos(clampedElevation) * orbitRadius;
      const angle = currentOrbitAngle.value + pointerInfluence.azimuth;
      c.position.set(
        Math.cos(angle) * horizontalRadius,
        y,
        Math.sin(angle) * horizontalRadius
      );
      c.up.set(0, 1, 0);
      c.lookAt(focus.x, focus.y, focus.z);
      c.updateProjectionMatrix();
    };

    const frameCity = () => {
      if (!model) return;

      const frameBounds = new THREE.Box3();
      if (bikeObj) {
        frameBounds.setFromObject(bikeObj);
      } else {
        const bike = model.getObjectByName('bike') || model.getObjectByProperty('name', 'Bike');
        if (bike) {
          frameBounds.setFromObject(bike);
        }
      }

      const bounds = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      bounds.getSize(size);

      if (frameBounds.isEmpty() || frameBounds.min.x === Infinity) {
        model.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const meshBounds = new THREE.Box3().setFromObject(child);
          const meshSize = new THREE.Vector3();
          meshBounds.getSize(meshSize);
          if (meshSize.y > 0.12) frameBounds.union(meshBounds);
        });
      }

      if (frameBounds.isEmpty()) frameBounds.copy(bounds);

      const frameSize = new THREE.Vector3();
      const frameCenter = new THREE.Vector3();
      frameBounds.getSize(frameSize);
      frameBounds.getCenter(frameCenter);

      focus.copy(frameCenter);

      const aspect =
        Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight);

      // Fit the bike tightly inside the camera view
      viewHeight = Math.max(0.1, Math.max(frameSize.z, frameSize.x / aspect)) * 1.3;

      camera.near = 0.1;
      camera.far = 1000;
      setRendererSize();
      positionCamera();
    };
    setRendererSize();
    positionCamera();

    const animate = (time = 0) => {
      if (disposed) return;
      animId = requestAnimationFrame(animate);
      targetOrbitAngle.value += orbitSpeed;
      currentOrbitAngle.value += (targetOrbitAngle.value - currentOrbitAngle.value) * 0.05;
      elevationPhase = time * 0.0002;
      positionCamera();
      renderer.render(scene, camera);
    };
    animate();

    const loader = new GLTFLoader();
    loader.load(
      asset('/city.glb'),
      (gltf) => {
        if (disposed) return;

        const gltfScene = gltf.scene;

        // Collect named objects we need to reference later.
        const nodes: { city: THREE.Object3D | null; bike: THREE.Object3D | null } = {
          city: null,
          bike: null,
        };
        gltfScene.traverse((child: THREE.Object3D) => {
          const name = child.name.trim().toLowerCase();
          if (name === 'city') nodes.city = child;
          if (name === 'bike') nodes.bike = child;
        });
        bikeObj = nodes.bike;

        // Reparent every top-level object into a single group so the whole
        // scene (city, bike, subway line, labels) is rendered and styled.
        const content = new THREE.Group();
        for (const child of [...gltfScene.children]) {
          content.add(child);
        }

        const box = new THREE.Box3().setFromObject(content);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / maxDim;
        content.scale.set(scale, scale, scale);
        content.position.set(
          -center.x * scale,
          -box.min.y * scale,
          -center.z * scale
        );
        content.rotation.x = 0;
        content.updateMatrixWorld(true);

        cityMaterial = new THREE.MeshBasicMaterial({
          color: 0x030303,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        });
        bikeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff3043,
          toneMapped: false,
        });
        subwayMaterial = new THREE.MeshBasicMaterial({
          color: 0x9b59b6,
          toneMapped: false,
        });
        whiteMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          toneMapped: false,
        });
        outlineMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          toneMapped: false,
        });

        const objectNames = (obj: THREE.Object3D): string[] => {
          const mesh = obj as THREE.Mesh;
          return [obj.name, mesh.geometry?.name]
            .filter(Boolean)
            .map((name) => name.trim().toLowerCase().replace(/[_\s]+/g, ' '));
        };

        const isBike = (obj: THREE.Object3D): boolean => {
          let current: THREE.Object3D | null = obj;
          while (current) {
            if (objectNames(current).includes('bike')) return true;
            current = current.parent;
          }
          return false;
        };
        const subwayNames: Record<string, true> = {
          cylinder: true,
          '7,7line': true,
          '7line': true,
          backplate: true,
        };
        const isSubway = (obj: THREE.Object3D): boolean => {
          let current: THREE.Object3D | null = obj;
          while (current) {
            if (objectNames(current).some((name) => subwayNames[name])) return true;
            current = current.parent;
          }
          return false;
        };
        const isWhite = (obj: THREE.Object3D): boolean => {
          let current: THREE.Object3D | null = obj;
          while (current) {
            if (
              objectNames(current).some((name) =>
                name === '7' || name === 'subway label' || name === '33rd'
              )
            ) {
              return true;
            }
            current = current.parent;
          }
          return false;
        };
        const getMaterial = (obj: THREE.Object3D): THREE.MeshBasicMaterial => {
          if (isBike(obj)) return bikeMaterial as THREE.MeshBasicMaterial;
          if (isWhite(obj)) return whiteMaterial as THREE.MeshBasicMaterial;
          if (isSubway(obj)) return subwayMaterial as THREE.MeshBasicMaterial;
          return cityMaterial as THREE.MeshBasicMaterial;
        };

        const getOutline = (obj: THREE.Object3D): boolean => {
          return !isBike(obj) && !isSubway(obj) && !isWhite(obj);
        };

        content.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = getMaterial(mesh);
            if (getOutline(mesh)) {
              const outlineGeometry = new THREE.EdgesGeometry(mesh.geometry, 12);
              const outline = new THREE.LineSegments(
                outlineGeometry,
                outlineMaterial as THREE.LineBasicMaterial
              );
              outlineGeometries.push(outlineGeometry);
              mesh.add(outline);
            }
          }
        });
        model = new THREE.Group();
        modelRef.current = model;
        model.add(content);

        // Ground plane sized to the city footprint only, not the river.
        const footprintSource =
          nodes.city && nodes.city.parent === content ? nodes.city : content;
        const cityBox = new THREE.Box3().setFromObject(footprintSource);
        const citySize = new THREE.Vector3();
        cityBox.getSize(citySize);

        const groundGeo = new THREE.PlaneGeometry(citySize.x, citySize.z);
        const groundMat = new THREE.MeshBasicMaterial({ color: 0x030303 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        const groundOutline = new THREE.LineSegments(
          new THREE.EdgesGeometry(groundGeo, 0),
          outlineMaterial as THREE.LineBasicMaterial
        );
        ground.add(groundOutline);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        model.add(ground);

        scene.add(model);
        frameCity();
      },
      undefined,
      (err) => {
        console.error('Failed to load city.glb:', err);
      }
    );
    // Orbit the camera from the shared tilt source — mouse on desktop, the
    // gyroscope on mobile — so the scene reacts in step with the page shadows.
    startTiltSource();
    const unsubscribeTilt = subscribeTilt((t) => {
      targetOffset.set(
        THREE.MathUtils.clamp(t.x, -1, 1),
        THREE.MathUtils.clamp(-t.y, -1, 1)
      );
      targetPointerInfluence.azimuth = -targetOffset.x * 0.6;
      targetPointerInfluence.elevation = targetOffset.y * 0.35;
    });

    resizeObserver = new ResizeObserver(() => {
      setRendererSize();
      frameCity();
    });
    resizeObserver.observe(container);
    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      resizeObserver?.disconnect();
      unsubscribeTilt();
      stopTiltSource();
      if (model) {
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
          }
        });
      }
      for (const geometry of outlineGeometries) geometry.dispose();
      cityMaterial?.dispose();
      bikeMaterial?.dispose();
      subwayMaterial?.dispose();
      whiteMaterial?.dispose();
      outlineMaterial?.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
