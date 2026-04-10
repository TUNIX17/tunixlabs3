'use client';

import styles from './kineticSwiss.module.css';

type SceneId = 'hero' | 'services' | 'case' | 'about' | 'contact';

interface BackgroundLayerProps {
  activeScene: SceneId;
}

const SCENE_IDS: SceneId[] = ['hero', 'services', 'case', 'about', 'contact'];

const SCENE_CLASS_MAP: Record<SceneId, string> = {
  hero: styles.bgHero,
  services: styles.bgServices,
  case: styles.bgCase,
  about: styles.bgAbout,
  contact: styles.bgContact,
};

/**
 * Full-viewport fixed background layer with 5 crossfading atmospheric scenes.
 * Only the active scene gets the .active class (opacity: 1 + ken-burns animation).
 * Each scene has radial-gradient overlays on top of a background-image slot (i18n).
 */
export function BackgroundLayer({ activeScene }: BackgroundLayerProps) {
  return (
    <div className={styles.bgLayer}>
      {SCENE_IDS.map((id) => (
        <div
          key={id}
          className={`${styles.bgScene} ${SCENE_CLASS_MAP[id]}${
            activeScene === id ? ` ${styles.bgSceneActive}` : ''
          }`}
          data-scene={id}
        />
      ))}
    </div>
  );
}
