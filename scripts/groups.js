import { html, render } from '../web_modules/lit-html.js';
import Utilities from './utilities.js';
import routes from './routes.js'
import Base from './base-component.js';

class Groups extends Base {
	constructor() {
		super('groups');
		this.filtrationKeys = {
			name: {
				type: 'search',
				column: 'name',
			},
		};
	}

	static load() {
		return Utilities.req(routes.groups);
	}

	static loadGroupMembers(groupId) {
		return Utilities.req(`${routes.groups}/${groupId}/${routes.members}`);
	}

	static loadGroupProjects(groupId) {
		const data = {
			simple: true,
			order_by: 'last_activity_at',
			per_page: 100,
		}
		const searchParams = new URLSearchParams(data).toString();
		return Utilities.req(`${routes.groups}/${groupId}/${routes.projects}`, searchParams);
	}

	drawListing(groups) {
		const groupsTemplates = [];
		for (const group of groups) {
			groupsTemplates.push(html`
				<tr>
					<td class="listing__avatar"><img src="${group.avatar_url || './images/group.svg'}" alt="${group.name}" /></td>
					<td data-key="name">${group.name}</td>
					<td class="listing__actions">
						<button @click=${()=> {this.showProjects(group.id)}}>Projects</button>
						<button @click=${()=> {this.showMembers(group.id)}}>Members</button>
					</td>
				</tr>
			`);
		}
		const nodes = html`
			<table class="listing">
				<thead>
					<tr>
						<th colspan="2">Name</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${groupsTemplates}
				</tbody>
			</table>
		`;
		render(nodes, document.querySelector('#groups-content'));
		this.updateCount(groups.length);
		this.updateLastModified();
		this.prepareFilters();
	}
}

export default Groups;
