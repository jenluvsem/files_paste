<?php
declare(strict_types=1);

namespace OCA\FilesPaste\AppInfo;

use OCA\FilesPaste\Listener\LoadAdditionalScriptsListener;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\EventDispatcher\IEventDispatcher;

class Application extends App implements IBootstrap {
	public const APP_ID = 'files_paste';

	public function __construct(array $params = []) {
		parent::__construct(self::APP_ID, $params);
	}

	public function boot(IBootContext $context): void {
	}

	public function register(IRegistrationContext $context): void {
		$context->registerEventListener(
			\OCA\Files\Event\LoadAdditionalScriptsEvent::class,
			LoadAdditionalScriptsListener::class
		);
	}
}
