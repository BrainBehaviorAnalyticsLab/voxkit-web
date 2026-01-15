/**
 * Decision Tree Module
 * 
 * A module for creating interactive decision trees where users navigate through
 * questions to reach helpful explanations or resources.
 * 
 * Example usage:
 * ```typescript
 * const tree = new DecisionTree("What do you need help with?");
 * tree.addQuestion("root", "How can we help?", "What type of issue?", {
 *   "Technical Problem": "technical",
 *   "Account Issue": "account"
 * }, true);
 * tree.addExplanation("technical", "Technical Support", 
 *                     "Visit our technical docs at...");
 * 
 * const widget = new DecisionTreeWidget(tree, document.getElementById('container'));
 * ```
 */

export interface ResourceLink {
  text: string;
  url: string;
}

export type ActionCallback = () => void;

/**
 * Base class for decision tree nodes
 */
export abstract class DecisionNode {
  constructor(
    public readonly nodeId: string,
    public readonly title: string
  ) {}

  abstract getType(): 'question' | 'explanation';
}

/**
 * A node representing a question with multiple choice answers
 */
export class QuestionNode extends DecisionNode {
  constructor(
    nodeId: string,
    title: string,
    public readonly question: string,
    public readonly choices: Map<string, string>
  ) {
    super(nodeId, title);
  }

  getType(): 'question' {
    return 'question';
  }
}

/**
 * A leaf node containing an explanation or resource information
 */
export class ExplanationNode extends DecisionNode {
  constructor(
    nodeId: string,
    title: string,
    public readonly content: string,
    public readonly links: ResourceLink[] = [],
    public readonly actionCallback?: ActionCallback
  ) {
    super(nodeId, title);
  }

  getType(): 'explanation' {
    return 'explanation';
  }
}

/**
 * Container for managing decision tree structure
 */
export class DecisionTree {
  private nodes: Map<string, DecisionNode> = new Map();
  private rootId: string | null = null;

  constructor(public readonly rootTitle: string = "Help") {}

  /**
   * Add a question node to the tree
   */
  addQuestion(
    nodeId: string,
    title: string,
    question: string,
    choices: Record<string, string>,
    isRoot: boolean = false
  ): this {
    const choicesMap = new Map(Object.entries(choices));
    const node = new QuestionNode(nodeId, title, question, choicesMap);
    this.nodes.set(nodeId, node);

    if (isRoot || this.rootId === null) {
      this.rootId = nodeId;
    }

    return this;
  }

  /**
   * Add an explanation (leaf) node to the tree
   */
  addExplanation(
    nodeId: string,
    title: string,
    content: string,
    links?: ResourceLink[],
    actionCallback?: ActionCallback
  ): this {
    const node = new ExplanationNode(nodeId, title, content, links, actionCallback);
    this.nodes.set(nodeId, node);
    return this;
  }

  /**
   * Get a node by its ID
   */
  getNode(nodeId: string): DecisionNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Get the root node
   */
  getRoot(): DecisionNode | undefined {
    return this.rootId ? this.nodes.get(this.rootId) : undefined;
  }
}

/**
 * Event listeners for the decision tree widget
 */
export interface DecisionTreeEventListeners {
  onLinkClick?: (url: string) => void;
  onNavigate?: (nodeId: string) => void;
  onReset?: () => void;
}

/**
 * Widget for displaying and navigating a decision tree
 */
export class DecisionTreeWidget {
  private container: HTMLElement;
  private tree: DecisionTree;
  private history: string[] = [];
  private currentNodeId: string | null = null;
  private listeners: DecisionTreeEventListeners;

  // DOM elements
  private backButton!: HTMLButtonElement;
  private titleLabel!: HTMLHeadingElement;
  private contentArea!: HTMLDivElement;
  private resetButton!: HTMLButtonElement;

  constructor(
    tree: DecisionTree,
    container: HTMLElement,
    listeners: DecisionTreeEventListeners = {}
  ) {
    this.tree = tree;
    this.container = container;
    this.listeners = listeners;

    this.setupUI();
    this.navigateToRoot();
  }

  private setupUI(): void {
    // Clear container
    this.container.innerHTML = '';
    this.container.className = 'decision-tree-widget';

    // Apply base styles
    this.applyStyles();

    // Create main wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'dt-wrapper';

    // Header with title and back button
    const header = document.createElement('div');
    header.className = 'dt-header';

    this.backButton = document.createElement('button');
    this.backButton.className = 'dt-back-button';
    this.backButton.innerHTML = '← Back';
    this.backButton.disabled = true;
    this.backButton.addEventListener('click', () => this.goBack());

    this.titleLabel = document.createElement('h2');
    this.titleLabel.className = 'dt-title';

    header.appendChild(this.backButton);
    header.appendChild(this.titleLabel);

    // Scrollable content area
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'dt-scroll-container';

    this.contentArea = document.createElement('div');
    this.contentArea.className = 'dt-content';

    scrollContainer.appendChild(this.contentArea);

    // Footer with reset button
    const footer = document.createElement('div');
    footer.className = 'dt-footer';

    this.resetButton = document.createElement('button');
    this.resetButton.className = 'dt-reset-button';
    this.resetButton.textContent = 'Start Over';
    this.resetButton.addEventListener('click', () => this.navigateToRoot());

    footer.appendChild(this.resetButton);

    // Assemble
    wrapper.appendChild(header);
    wrapper.appendChild(scrollContainer);
    wrapper.appendChild(footer);
    this.container.appendChild(wrapper);
  }

  private applyStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .decision-tree-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .dt-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .dt-header {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        border-bottom: 1px solid #e0e0e0;
        background-color: #f9f9f9;
      }

      .dt-back-button {
        padding: 8px 16px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .dt-back-button:hover:not(:disabled) {
        background-color: #f0f0f0;
      }

      .dt-back-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .dt-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }

      .dt-scroll-container {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      .dt-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .dt-question-text {
        font-size: 16px;
        color: #333;
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .dt-choice-button {
        padding: 12px 16px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        text-align: left;
        transition: all 0.2s;
        min-height: 48px;
      }

      .dt-choice-button:hover {
        background-color: #f5f5f5;
        border-color: #999;
        transform: translateX(4px);
      }

      .dt-explanation-content {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        white-space: pre-wrap;
      }

      .dt-links-section {
        margin-top: 16px;
      }

      .dt-links-title {
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
        font-size: 14px;
      }

      .dt-link-button {
        display: block;
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 8px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        text-align: left;
        color: #0066cc;
        transition: background-color 0.2s;
      }

      .dt-link-button:hover {
        background-color: #f0f0f0;
      }

      .dt-action-button {
        width: 100%;
        padding: 12px;
        margin-top: 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: background-color 0.2s;
      }

      .dt-action-button:hover {
        background-color: #45a049;
      }

      .dt-footer {
        padding: 16px 20px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
        background-color: #f9f9f9;
      }

      .dt-reset-button {
        padding: 8px 16px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .dt-reset-button:hover {
        background-color: #f0f0f0;
      }
    `;
    document.head.appendChild(style);
  }

  private clearContent(): void {
    this.contentArea.innerHTML = '';
  }

  private navigateToRoot(): void {
    this.history = [];
    const root = this.tree.getRoot();
    if (root) {
      this.displayNode(root);
    }
    this.backButton.disabled = true;
    this.listeners.onReset?.();
  }

  private navigateTo(nodeId: string): void {
    const node = this.tree.getNode(nodeId);
    if (node) {
      if (this.currentNodeId) {
        this.history.push(this.currentNodeId);
      }
      this.displayNode(node);
      this.backButton.disabled = this.history.length === 0;
      this.listeners.onNavigate?.(nodeId);
    }
  }

  private goBack(): void {
    if (this.history.length > 0) {
      const previousNodeId = this.history.pop()!;
      const node = this.tree.getNode(previousNodeId);
      if (node) {
        this.displayNode(node);
      }
      this.backButton.disabled = this.history.length === 0;
    }
  }

  private displayNode(node: DecisionNode): void {
    this.currentNodeId = node.nodeId;
    this.clearContent();
    this.titleLabel.textContent = node.title;

    if (node instanceof QuestionNode) {
      this.displayQuestion(node);
    } else if (node instanceof ExplanationNode) {
      this.displayExplanation(node);
    }
  }

  private displayQuestion(node: QuestionNode): void {
    // Question text
    const questionText = document.createElement('div');
    questionText.className = 'dt-question-text';
    questionText.textContent = node.question;
    this.contentArea.appendChild(questionText);

    // Choice buttons
    node.choices.forEach((nextNodeId, choiceText) => {
      const button = document.createElement('button');
      button.className = 'dt-choice-button';
      button.textContent = choiceText;
      button.addEventListener('click', () => this.navigateTo(nextNodeId));
      this.contentArea.appendChild(button);
    });
  }

  private displayExplanation(node: ExplanationNode): void {
    // Content text
    const content = document.createElement('div');
    content.className = 'dt-explanation-content';
    content.textContent = node.content;
    this.contentArea.appendChild(content);

    // Links section
    if (node.links.length > 0) {
      const linksSection = document.createElement('div');
      linksSection.className = 'dt-links-section';

      const linksTitle = document.createElement('div');
      linksTitle.className = 'dt-links-title';
      linksTitle.textContent = 'Resources:';
      linksSection.appendChild(linksTitle);

      node.links.forEach(link => {
        const linkButton = document.createElement('button');
        linkButton.className = 'dt-link-button';
        linkButton.innerHTML = `🔗 ${link.text}`;
        linkButton.addEventListener('click', () => {
          this.listeners.onLinkClick?.(link.url);
        });
        linksSection.appendChild(linkButton);
      });

      this.contentArea.appendChild(linksSection);
    }

    // Custom action button
    if (node.actionCallback) {
      const actionButton = document.createElement('button');
      actionButton.className = 'dt-action-button';
      actionButton.textContent = 'Take Action';
      actionButton.addEventListener('click', node.actionCallback);
      this.contentArea.appendChild(actionButton);
    }
  }

  /**
   * Programmatically navigate to a specific node
   */
  public navigateToNode(nodeId: string): void {
    this.navigateTo(nodeId);
  }

  /**
   * Reset to the root node
   */
  public reset(): void {
    this.navigateToRoot();
  }

  /**
   * Get the current node ID
   */
  public getCurrentNodeId(): string | null {
    return this.currentNodeId;
  }

  /**
   * Destroy the widget and clean up
   */
  public destroy(): void {
    this.container.innerHTML = '';
  }
}