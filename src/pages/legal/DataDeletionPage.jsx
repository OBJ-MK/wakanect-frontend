export function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#0F1C3F]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Suppression des données — Wakanect</h1>
        <p className="text-sm text-[#0F1C3F]/60 mb-10">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Comment demander la suppression de vos données</h2>
          <p className="mb-3">
            Si vous êtes un commerçant utilisant Wakanect, ou un client ayant passé commande sur une
            boutique Wakanect, vous pouvez demander la suppression de vos données personnelles à tout
            moment.
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Envoyez un e-mail à{' '}
              <a href="mailto:contact@wakanect.com" className="text-[#EC5E2A] underline">
                contact@wakanect.com
              </a>{' '}
              avec pour objet « Suppression de données ».
            </li>
            <li>
              Indiquez le numéro de téléphone WhatsApp associé à votre compte (commerçant) ou utilisé
              lors de votre commande (client).
            </li>
            <li>
              Nous confirmons la réception de votre demande sous 48h, puis procédons à la suppression
              sous 30 jours maximum.
            </li>
            <li>
              Vous recevez une confirmation par e-mail ou WhatsApp une fois la suppression effectuée.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Ce qui est supprimé</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Les informations de votre compte et de votre boutique (commerçants)</li>
            <li>L'historique des produits et messages transférés associés à votre compte</li>
            <li>Les données de commande vous concernant (clients)</li>
          </ul>
          <p className="mt-3">
            Certaines données peuvent être conservées plus longtemps si la loi l'exige (par exemple à
            des fins comptables ou fiscales), mais elles ne seront plus utilisées à d'autres fins.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Nous contacter</h2>
          <p>
            Pour toute question sur cette procédure, écrivez-nous à{' '}
            <a href="mailto:contact@wakanect.com" className="text-[#EC5E2A] underline">
              contact@wakanect.com
            </a>
            . Pour en savoir plus sur l'utilisation de vos données, consultez notre{' '}
            <a href="/politique-confidentialite" className="text-[#EC5E2A] underline">
              politique de confidentialité
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}