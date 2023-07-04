<?php
namespace CodeQ\LostInTranslation\UiSyncButton\Controller;

/*
 * This file is part of the CodeQ.LostInTranslation.UiSyncButton package.
 */

use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\Context;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Exception\InvalidLocaleIdentifierException;
use Neos\Flow\I18n\Locale;
use Neos\Flow\I18n\Service;
use Neos\Flow\I18n\Translator;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\View\JsonView;
use Neos\Neos\Controller\CreateContentContextTrait;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Error;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Info;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Success;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\FeedbackCollection;

class TranslationServiceController extends ActionController
{
    use CreateContentContextTrait;

    /**
     * @var array
     */
    protected $supportedMediaTypes = ['application/json'];

    /**
     * @var string
     */
    protected $defaultViewObjectName = JsonView::class;

    /**
     * @Flow\Inject
     * @var FeedbackCollection
     */
    protected $feedbackCollection;

    /**
     * @Flow\Inject
     * @var Service
     */
    protected $localizationService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var Translator
     */
    protected $translator;

    protected function initializeController(ActionRequest $request, ActionResponse $response)
    {
        parent::initializeController($request, $response);
        $this->feedbackCollection->setControllerContext($this->getControllerContext());

        try {
            $this->localizationService->getConfiguration()->setCurrentLocale(new Locale($this->userService->getInterfaceLanguage()));
        } catch (InvalidLocaleIdentifierException $e) {
            // Do nothing, stay in the default locale
        }
    }

    /**
     * @return void
     */
    public function translateAction(Node $node, string $sourceLanguage): void
    {
        $workspaceName = $node->getContext()->getWorkspaceName();
        $sourceContext = $this->createSourceContext($workspaceName, $sourceLanguage);
        $sourceNode = $sourceContext->getNodeByIdentifier((string) $node->getNodeAggregateIdentifier());

        if (!$sourceNode) {
            $error = new Error();
            $error->setMessage($this->translator->translateById('noDocumentFoundInSourceLanguage', [], null, null, 'Main', 'CodeQ.LostInTranslation.UiSyncButton'));
            $this->feedbackCollection->add($error);
        } else {
            $node->getContext()->adoptNode($sourceNode, true);
            $this->removeOrphanChildNodesRecursively($node, $sourceContext);

            $success = new Success();
            $success->setMessage($this->translator->translateById('documentTranslatedSuccessfully', [], null, null, 'Main', 'CodeQ.LostInTranslation.UiSyncButton'));
            $this->feedbackCollection->add($success);
            $this->feedbackCollection->add(new ReloadDocument());
        }

        $this->view->assign('value', $this->feedbackCollection);
    }

    protected function removeOrphanChildNodesRecursively(NodeInterface $node, Context $sourceContext): void
    {
        foreach ($node->getChildNodes() as $childNode) {
            if ($childNode->getNodeType()->isAggregate()) {
                continue;
            }

            $sourceNode = $sourceContext->getNodeByIdentifier($childNode->getIdentifier());
            $info = new Info();
            $info->setMessage($childNode->getIdentifier());
            $this->feedbackCollection->add($info);

            if (!$sourceNode) {
                $childNode->remove();
                $info = new Info();
                $info->setMessage('Removed node');
                $this->feedbackCollection->add($info);
            }

            $this->removeOrphanChildNodesRecursively($childNode, $sourceContext);
        }
    }

    protected function createSourceContext(string $workspaceName, string $sourceLanguage): ContentContext
    {
        return $this->createContentContext($workspaceName, ['language' => [$sourceLanguage]]);
    }
}
