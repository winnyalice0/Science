# Example 3D Model Template

## For Three.js HTML Models

Create a file like `/public/3d-models/biology/heart.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Heart 3D Model</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
        #info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div id="info">
        <strong>Heart Model</strong><br>
        Drag to rotate<br>
        Scroll to zoom
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Create heart shape (simplified)
        function createHeart() {
            const geometry = new THREE.BufferGeometry();
            // Heart shape vertices would go here
            // For now, using a simple sphere as placeholder
            const heartGeom = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0xff4444,
                metalness: 0.3,
                roughness: 0.4
            });
            const heart = new THREE.Mesh(heartGeom, material);
            heart.castShadow = true;
            heart.receiveShadow = true;
            return heart;
        }

        const heart = createHeart();
        scene.add(heart);

        // Handle mouse controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        renderer.domElement.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                heart.rotation.y += deltaX * 0.01;
                heart.rotation.x += deltaY * 0.01;

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });

        renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            camera.position.z += e.deltaY * 0.01;
            camera.position.z = Math.max(1, Math.min(20, camera.position.z));
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Auto-rotate if not dragging
            if (!isDragging) {
                heart.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>
```

## For Babylon.js Models

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Model</title>
    <style>
        html, body {
            overflow: hidden;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        #renderCanvas {
            width: 100%;
            height: 100%;
            display: block;
        }
    </style>
</head>
<body>
    <canvas id="renderCanvas"></canvas>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script>
        const canvas = document.getElementById('renderCanvas');
        const engine = new BABYLON.Engine(canvas, true);
        
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.18);

        const camera = new BABYLON.UniversalCamera(
            'camera',
            new BABYLON.Vector3(0, 0, 10),
            scene
        );
        camera.attachControl(canvas, true);
        camera.inertia = 0.7;
        camera.angularSensibility = 1000;

        const light = new BABYLON.HemisphericLight(
            'light',
            new BABYLON.Vector3(0, 1, 0),
            scene
        );
        light.intensity = 0.8;

        // Create model
        const sphere = BABYLON.MeshBuilder.CreateSphere(
            'sphere',
            { diameter: 2 },
            scene
        );
        sphere.material = new BABYLON.StandardMaterial('mat', scene);
        sphere.material.diffuse = new BABYLON.Color3(1, 0.27, 0.27);

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    </script>
</body>
</html>
```

## For Babylon.js with Model Loading

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        html, body {
            overflow: hidden;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        #renderCanvas {
            width: 100%;
            height: 100%;
            display: block;
        }
        #info {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
            font-family: Arial;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div id="info">Loading model...</div>
    <canvas id="renderCanvas"></canvas>
    
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script>
        const canvas = document.getElementById('renderCanvas');
        const engine = new BABYLON.Engine(canvas, true);
        
        const createScene = () => {
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.18);

            const camera = new BABYLON.UniversalCamera(
                'camera',
                new BABYLON.Vector3(0, 0, 10),
                scene
            );
            camera.attachControl(canvas, true);

            const light = new BABYLON.HemisphericLight(
                'light',
                new BABYLON.Vector3(0, 1, 0),
                scene
            );
            light.intensity = 0.9;

            // Load GLB/GLTF model
            BABYLON.SceneLoader.ImportMesh(
                '',
                'path/to/models/',
                'model.glb',
                scene,
                (meshes) => {
                    document.getElementById('info').textContent = 'Model loaded!';
                    meshes.forEach((mesh) => {
                        mesh.receiveShadow = true;
                        mesh.castShadow = true;
                    });
                }
            );

            return scene;
        };

        const scene = createScene();

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    </script>
</body>
</html>
```

## Deployment Steps

1. Create HTML file in appropriate directory:
   - `/public/3d-models/biology/organ-name.html`
   - `/public/3d-models/chemistry/molecule-name.html`
   - `/public/3d-models/lab/equipment-name.html`

2. Add corresponding entry to `organs-3d-data.ts`

3. Create thumbnail image:
   - `/public/3d-models/biology/organ-name-thumb.png`

4. Update the model path in data entry to match

## Best Practices

- Keep models optimized for web (low polygon count)
- Use proper lighting for better visualization
- Include clear instructions for user interaction
- Load models asynchronously
- Add loading indicators
- Test on various browsers and devices
- Use standard formats (GLB, GLTF, OBJ)
