import { describe, expect, it } from 'vitest';
import {
  classifyTask,
  selectSkills,
  shouldUseMetaWorkflow,
} from './registry';

describe('mastra skill registry', () => {
  it('classifies troubleshooting requests', () => {
    expect(classifyTask('The chat route is failing with an error.')).toBe(
      'troubleshooting',
    );
  });

  it('classifies planning requests', () => {
    expect(classifyTask('Create a migration plan for this backend.')).toBe(
      'planning',
    );
  });

  it('keeps short conversational prompts as simple chat', () => {
    expect(classifyTask('Hello there')).toBe('simple_chat');
    expect(shouldUseMetaWorkflow('simple_chat')).toBe(false);
  });

  it('selects critique and planning skills for complex tasks', () => {
    const skills = selectSkills('analysis').map((skill) => skill.id);

    expect(skills).toContain('interpret-task');
    expect(skills).toContain('build-plan');
    expect(skills).toContain('draft-answer');
    expect(skills).toContain('self-critique');
  });
});
