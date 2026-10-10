// Publie une version d'aperçu sur Vercel (projet « hugogillard-apercu » de l'équipe Adista),
// sans toucher au site en ligne : build avec NEXT_PUBLIC_APERCU=1 (pages masquées aux moteurs,
// traceur coupé, formulaire inactif), puis envoi du dossier out/. Nécessite `vercel login`.
import { execSync } from 'node:child_process';

execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_APERCU: '1' } });
execSync('vercel deploy out --prod --yes', {
  stdio: 'inherit',
  env: {
    ...process.env,
    VERCEL_ORG_ID: 'team_Pd32pfJoVpwDGRzipymb7zxa',
    VERCEL_PROJECT_ID: 'prj_4sPsC1uPxUzP8f5yOvNo8JAycW2j',
  },
});
