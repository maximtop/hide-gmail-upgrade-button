/**
 * @file Typed contracts for messages exchanged between extension contexts.
 */

import { CALENDAR_DISABLE_MESSAGE_TYPE } from './constants';

/**
 * Requests that a Calendar content script stop and restore the page after
 * optional host access is revoked.
 */
export interface CalendarDisableMessage {
    /**
     * Identifies the Calendar cleanup command.
     */
    type: typeof CALENDAR_DISABLE_MESSAGE_TYPE;
}

/**
 * Message payloads exchanged between this extension's trusted contexts.
 */
export type ExtensionMessage = CalendarDisableMessage;
