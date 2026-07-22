"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Save, RotateCcw, Plus, X, Pencil } from "lucide-react";
import { BOARD_SHAPES, BOARD_COLORS, getShape } from "@/lib/boardShapes";
import styles from "./Board3D.module.css";

const GRID_EXTENT = 3.5;
const CANVAS_HEIGHT = 360;

function randomSpawn() {
  const range = GRID_EXTENT - 1;
  return {
    x: (Math.random() - 0.5) * range * 2,
    z: (Math.random() - 0.5) * range * 2,
  };
}

export default function Board3D() {
  const canvasRef = useRef(null);
  const three = useRef(null);
  const nextColorIndex = useRef(0);
  const nextObjectNumber = useRef(1);

  const [objects, setObjects] = useState([]);
  const [selectedShape, setSelectedShape] = useState(BOARD_SHAPES[0].id);
  const [nameInput, setNameInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = CANVAS_HEIGHT;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 9);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const board = new THREE.Group();
    scene.add(board);
    board.add(new THREE.GridHelper(8, 8, 0x3a3b3d, 0x2a2b2d));
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({ color: 0x141516, transparent: true, opacity: 0.5 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    board.add(floor);

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();

    const state = {
      renderer,
      scene,
      camera,
      board,
      meshes: [],
      savedPositions: new Map(),
      dragging: null,
      rotating: false,
      last: { x: 0, y: 0 },
      frameId: null,
    };
    three.current = state;

    function setNdc(e) {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onPointerDown(e) {
      setNdc(e);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(state.meshes);
      if (hits.length) {
        state.dragging = hits[0].object;
        dragPlane.constant = -state.dragging.getWorldPosition(new THREE.Vector3()).y;
        canvas.style.cursor = "grabbing";
      } else {
        state.rotating = true;
        state.last = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = "grabbing";
      }
      canvas.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (state.dragging) {
        setNdc(e);
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
          const local = board.worldToLocal(hitPoint.clone());
          local.x = Math.max(-GRID_EXTENT, Math.min(GRID_EXTENT, local.x));
          local.z = Math.max(-GRID_EXTENT, Math.min(GRID_EXTENT, local.z));
          state.dragging.position.x = local.x;
          state.dragging.position.z = local.z;
        }
      } else if (state.rotating) {
        const dx = e.clientX - state.last.x;
        const dy = e.clientY - state.last.y;
        board.rotation.y += dx * 0.008;
        board.rotation.x = Math.max(-0.5, Math.min(0.9, board.rotation.x + dy * 0.006));
        state.last = { x: e.clientX, y: e.clientY };
      }
    }

    function onPointerEnd() {
      state.dragging = null;
      state.rotating = false;
      canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerEnd);
    canvas.addEventListener("pointercancel", onPointerEnd);

    function handleResize() {
      const w = canvas.clientWidth;
      renderer.setSize(w, height, false);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    function loop() {
      state.frameId = requestAnimationFrame(loop);
      renderer.render(scene, camera);
    }
    loop();

    return () => {
      cancelAnimationFrame(state.frameId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("resize", handleResize);
      state.meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  function addObject() {
    const state = three.current;
    if (!state) return;

    const shape = getShape(selectedShape);
    const color = BOARD_COLORS[nextColorIndex.current % BOARD_COLORS.length];
    nextColorIndex.current += 1;
    const id = `obj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const name = nameInput.trim() || `Object ${nextObjectNumber.current}`;
    nextObjectNumber.current += 1;

    const geometry = shape.makeGeometry();
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1 });
    const mesh = new THREE.Mesh(geometry, material);
    const spawn = randomSpawn();
    mesh.position.set(spawn.x, shape.restY, spawn.z);
    mesh.userData.id = id;

    state.board.add(mesh);
    state.meshes.push(mesh);

    setObjects((prev) => [...prev, { id, name, shape: shape.id, color }]);
    setNameInput("");
  }

  function removeObject(id) {
    const state = three.current;
    if (state) {
      const index = state.meshes.findIndex((mesh) => mesh.userData.id === id);
      if (index !== -1) {
        const mesh = state.meshes[index];
        if (state.dragging === mesh) state.dragging = null;
        state.board.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        state.meshes.splice(index, 1);
      }
      state.savedPositions.delete(id);
    }
    setObjects((prev) => prev.filter((o) => o.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function startEdit(obj) {
    setEditingId(obj.id);
    setEditingValue(obj.name);
  }

  function commitEdit() {
    const value = editingValue.trim();
    if (value) {
      setObjects((prev) =>
        prev.map((o) => (o.id === editingId ? { ...o, name: value } : o))
      );
    }
    setEditingId(null);
  }

  function handleSave() {
    const state = three.current;
    if (!state) return;
    state.savedPositions = new Map(
      state.meshes.map((mesh) => [mesh.userData.id, mesh.position.clone()])
    );
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1400);
  }

  function handleRestore() {
    const state = three.current;
    if (!state) return;
    state.meshes.forEach((mesh) => {
      const saved = state.savedPositions.get(mesh.userData.id);
      if (saved) mesh.position.copy(saved);
    });
  }

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Action &middot; 3D board</span>
        <div className={styles.headerActions}>
          <button type="button" className={styles.saveButton} onClick={handleSave}>
            <Save size={14} />
            Save positions
          </button>
          <button type="button" className={styles.restoreButton} onClick={handleRestore}>
            <RotateCcw size={14} />
            Restore
          </button>
        </div>
      </div>

      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.hint}>Drag an object to move it &middot; drag empty space to rotate</div>
        <div className={styles.savedFlash} data-visible={savedFlash}>
          Positions saved
        </div>
      </div>

      <div className={styles.addRow}>
        <div className={styles.shapePicker}>
          {BOARD_SHAPES.map((shape) => {
            const Icon = shape.icon;
            return (
              <button
                key={shape.id}
                type="button"
                className={styles.shapeButton}
                data-active={selectedShape === shape.id}
                onClick={() => setSelectedShape(shape.id)}
                title={shape.label}
                aria-label={shape.label}
              >
                <Icon size={16} strokeWidth={1.75} />
              </button>
            );
          })}
        </div>
        <input
          className={styles.nameInput}
          placeholder="Name this object"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addObject();
          }}
        />
        <button type="button" className={styles.addButton} onClick={addObject}>
          <Plus size={14} />
          Add
        </button>
      </div>

      {objects.length > 0 && (
        <div className={styles.legend}>
          {objects.map((obj) => {
            const shape = getShape(obj.shape);
            const Icon = shape.icon;
            return (
              <div key={obj.id} className={styles.legendItem}>
                <span className={styles.swatch} style={{ color: obj.color }}>
                  <Icon size={14} strokeWidth={2} />
                </span>
                {editingId === obj.id ? (
                  <input
                    autoFocus
                    className={styles.legendInput}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                    }}
                  />
                ) : (
                  <button type="button" className={styles.legendName} onClick={() => startEdit(obj)}>
                    {obj.name}
                    <Pencil size={11} className={styles.pencil} />
                  </button>
                )}
                <button
                  type="button"
                  className={styles.legendRemove}
                  onClick={() => removeObject(obj.id)}
                  aria-label={`Remove ${obj.name}`}
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
