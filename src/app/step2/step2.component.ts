import { Component, OnInit, Input } from '@angular/core';
import { TranslationNode } from '../helpers';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {
  @Input() nodes: TranslationNode[];
  filteredNodes: TranslationNode[];
  filterText = '';
  newNode: TranslationNode = { key: '', en: '', fr: '', nl: '' };

  ngOnInit() {
    this.onFilter('');
  }

  onFilter($event: string) {
    this.filterText = $event;
    this.filteredNodes = this.nodes.filter(item => item.key.indexOf(this.filterText) !== -1);
  }
  addNode() {
    this.nodes.push(this.newNode);
    this.newNode = { key: '', en: '', fr: '', nl: '' };
    this.onFilter('');
  }

  removeNode(key: string) {
    const indexToRemove = this.nodes.findIndex(node => node.key === key);
    this.nodes = [...this.nodes.splice(indexToRemove, 1)];
  }
}
