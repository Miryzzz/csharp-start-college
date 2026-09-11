import { useEffect, useRef, useState } from 'react';
import { courseTopics, type TopicId } from '../content/course';

interface TopicExplorerProps {
  onVisit: (id: TopicId) => void;
}

export function TopicExplorer({ onVisit }: TopicExplorerProps) {
  const [activeId, setActiveId] = useState<TopicId>(courseTopics[0].id);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeTopic = courseTopics.find((topic) => topic.id === activeId) ?? courseTopics[0];

  useEffect(() => {
    onVisit(activeId);
  }, [activeId, onVisit]);

  const selectTopic = (id: TopicId) => setActiveId(id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'ArrowRight'
      ? (index + 1) % courseTopics.length
      : event.key === 'ArrowLeft'
        ? (index - 1 + courseTopics.length) % courseTopics.length
        : event.key === 'Home' ? 0 : courseTopics.length - 1;
    const nextTopic = courseTopics[nextIndex];
    selectTopic(nextTopic.id);
    tabs.current[nextIndex]?.focus();
  };

  return (
    <section className="topics-section section-shell" id="basics" aria-labelledby="topics-title">
      <div className="section-intro">
        <p className="eyebrow">02 · Основы C#</p>
        <h2 id="topics-title">Пять строительных блоков кода</h2>
        <p>Откройте каждую вкладку: короткое объяснение, пример и результат помогут увидеть смысл синтаксиса.</p>
      </div>
      <div className="topic-explorer glass-card">
        <div className="topic-tabs" role="tablist" aria-label="Темы основ C#">
          {courseTopics.map((topic, index) => (
            <button
              className="topic-tab"
              type="button"
              key={topic.id}
              id={`topic-tab-${topic.id}`}
              role="tab"
              ref={(element) => { tabs.current[index] = element; }}
              aria-selected={activeId === topic.id}
              aria-controls={`topic-panel-${topic.id}`}
              tabIndex={activeId === topic.id ? 0 : -1}
              onClick={() => selectTopic(topic.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {topic.title}
            </button>
          ))}
        </div>
        <article className="topic-panel" id={`topic-panel-${activeTopic.id}`} role="tabpanel" aria-labelledby={`topic-tab-${activeTopic.id}`}>
          <div className="topic-copy">
            <p className="topic-summary">{activeTopic.summary}</p>
            <p>{activeTopic.explanation}</p>
          </div>
          <div className="topic-code">
            <p>Пример</p>
            <pre><code>{activeTopic.code}</code></pre>
            <p className="topic-output"><span aria-hidden="true">›</span> {activeTopic.output}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
