import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useFamilyData } from '../context/FamilyContext';
import { Button } from '../components/ui/Button';
import { PersonBackButton } from '../components/person/PersonBackButton';
import { PersonHeroCard } from '../components/person/PersonHeroCard';
import { PersonInfoGrid } from '../components/person/PersonInfoGrid';
import { PersonRelationships } from '../components/person/PersonRelationships';

export function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPersonById } = useFamilyData();

  const person = id ? getPersonById(id) : undefined;

  if (!person) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-surface-elevated"
        >
          🔍
        </div>
        <h1 className="text-xl font-bold text-primary">
          {t('errors.personNotFound')}
        </h1>
        <p className="text-muted">{t('errors.personNotFoundDesc')}</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          ← {t('person.backToTree')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <PersonBackButton />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <PersonHeroCard person={person} />
        <PersonInfoGrid person={person} />
        <PersonRelationships personUuid={person.uuid} />
      </div>
    </div>
  );
}
