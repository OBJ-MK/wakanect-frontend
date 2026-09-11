export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#0F1C3F]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Politique de confidentialité de Wakanect</h1>
        <p className="text-sm text-[#0F1C3F]/60 mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Qui nous sommes</h2>
          <p className="mb-3">
            Wakanect (« nous », « notre ») est une plateforme qui permet aux commerçants d'Afrique
            de transformer les messages produits qu'ils envoient sur WhatsApp en une boutique en ligne
            accessible via un lien web indépendant. Cette politique explique quelles données nous collectons,
            pourquoi, et comment elles sont utilisées.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. Données que nous collectons</h2>
          <p className="mb-2 font-medium">Pour les commerçants (utilisateurs de l'application Wakanect) :</p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>Nom, numéro de téléphone WhatsApp et informations de la boutique (nom, logo, adresse)</li>
            <li>Le contenu des messages transférés au numéro WhatsApp Wakanect (texte et images de produits)</li>
            <li>Les commandes reçues via la boutique publique</li>
            <li>Les informations de facturation liées à l'abonnement Wakanect</li>
          </ul>
          <p className="mb-2 font-medium">Pour les clients des boutiques (acheteurs) :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nom et numéro de téléphone renseignés lors d'une commande sur une boutique publique</li>
            <li>Aucune donnée de paiement n'est collectée par Wakanect : les paiements se font directement
              entre l'acheteur et le commerçant, en dehors de l'application</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. Comment nous utilisons ces données</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Extraire automatiquement les informations produit (nom, prix, quantité, variantes) à partir
              des messages WhatsApp transférés, à l'aide d'outils de traitement de texte et d'intelligence
              artificielle</li>
            <li>Générer et maintenir à jour le catalogue et la boutique publique du commerçant</li>
            <li>Permettre aux clients de passer commande et au commerçant de la traiter</li>
            <li>Envoyer des notifications utiles au commerçant (nouvelle commande, stock bas, produit à valider)</li>
            <li>Gérer l'abonnement et la facturation du service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Partage des données avec des tiers</h2>
          <p className="mb-2">Nous faisons appel aux prestataires suivants pour faire fonctionner le service :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Meta / WhatsApp Business Platform</strong> — pour recevoir les messages transférés par les commerçants</li>
            <li><strong>Prestataires d'intelligence artificielle</strong> (dont Cloudflare Workers AI, DeepSeek et Anthropic) — pour extraire les informations produit des messages, de façon automatisée</li>
            <li><strong>Cloudflare</strong> — hébergement du site et stockage des images produits</li>
            <li><strong>MongoDB Atlas</strong> — hébergement de la base de données</li>
            <li><strong>Render</strong> — hébergement du serveur applicatif</li>
            <li><strong>Prestataires de paiement d'abonnement</strong> — uniquement pour la facturation de l'abonnement Wakanect au commerçant, jamais pour les paiements entre commerçant et client</li>
          </ul>
          <p className="mt-3">
            Nous ne vendons aucune donnée personnelle à des tiers à des fins publicitaires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. Conservation des données</h2>
          <p>
            Les données sont conservées tant que le compte du commerçant est actif. Les données statistiques
            anonymisées peuvent être conservées plus longtemps à des fins d'amélioration du service. Un
            commerçant peut demander la suppression de son compte et de ses données à tout moment (voir
            section « Suppression des données » ci-dessous).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
          <p>
            Vous pouvez demander à tout moment l'accès, la rectification ou la suppression de vos données
            personnelles en nous contactant à l'adresse indiquée en bas de page.
          </p>
        </section>

        <section id="suppression-donnees" className="mb-8 scroll-mt-8">
          <h2 className="text-xl font-semibold mb-3">7. Suppression des données</h2>
          <p className="mb-3">
            Pour demander la suppression de votre compte et de l'ensemble des données associées
            (informations de boutique, produits, commandes, historique de messages), envoyez un e-mail à{' '}
            <a href="mailto:contact@wakanect.com" className="text-[#EC5E2A] underline">contact@wakanect.com</a>{' '}
            avec le numéro de téléphone associé à votre compte.
          </p>
          <p>
            Votre demande sera traitée sous 30 jours maximum. Vous recevrez une confirmation une fois la
            suppression effectuée.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">8. Nous contacter</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou vos données,
            contactez-nous à{' '}
            <a href="mailto:contact@wakanect.com" className="text-[#EC5E2A] underline">contact@wakanect.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}