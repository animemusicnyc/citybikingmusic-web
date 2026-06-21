import { asset, Page, team } from '../lib/common';

export default function TeamPage() {
  return (
    <Page title="Team" index="02" kicker="Engineers, producers, and visual support">
      <div class="team-list">
        {team.map((member) => (
          <article class="team-item" key={member.name}>
            <img src={asset(member.image)} alt={member.name} />
            <div>
              <h2>{member.name}</h2>
              <p class="role">{member.role}</p>
              <p>{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}
