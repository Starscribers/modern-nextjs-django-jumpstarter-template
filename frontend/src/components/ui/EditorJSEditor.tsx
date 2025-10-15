'use client';

import { OutputData } from '@editorjs/editorjs';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// Dynamically import EditorJS and plugins to avoid SSR issues
let EditorJS: any;
let Header: object;
let List: object;
let NestedList: object;
let Paragraph: object;
let Quote: any;
let Warning: object;
let Delimiter: object;
let Code: any;
let Raw: object;
let Table: any;
let SimpleImage: any;
let Image: any;
let Link: object;
let Attaches: object;
let Embed: object;
let Checklist: object;
let NestedChecklist: object;
let Marker: object;
let InlineCode: any;
let Underline: any;
let LinkAutocomplete: any;
let Strikethrough: object;
let TextColorPlugin: object;
let Alert: object;
let ToggleBlock: object;
let Button: object;
let Columns: object;
let TextVariantTune: any;
let DragDrop: object;
let Undo: object;

// Dynamic imports
const loadEditorJS = async () => {
  if (typeof window !== 'undefined') {
    try {
      const [
        EditorJSModule,
        HeaderModule,
        ListModule,
        NestedListModule,
        ParagraphModule,
        QuoteModule,
        WarningModule,
        DelimiterModule,
        CodeModule,
        // @ts-ignore
        RawModule,
        TableModule,
        // @ts-ignore
        SimpleImageModule,
        ImageModule,
        // @ts-ignore
        LinkModule,
        // @ts-ignore
        AttachesModule,
        // @ts-ignore
        EmbedModule,
        // @ts-ignore
        ChecklistModule,
        // @ts-ignore
        NestedChecklistModule,
        MarkerModule,
        InlineCodeModule,
        UnderlineModule,
        // @ts-ignore
        LinkAutocompleteModule,
        // @ts-ignore
        StrikethroughModule,
        // Temporarily disable text color plugin due to initialization issues
        // // @ts-ignore
        // TextColorPluginModule,
        // @ts-ignore
        AlertModule,
        // @ts-ignore
        ToggleBlockModule,
        // @ts-ignore
        ButtonModule,
        // @ts-ignore
        ColumnsModule,
        // @ts-ignore
        TextVariantTuneModule,
        // @ts-ignore
        DragDropModule,
        // @ts-ignore
        UndoModule,
      ] = await Promise.all([
        import('@editorjs/editorjs'),
        import('@editorjs/header'),
        import('@editorjs/list'),
        import('@editorjs/nested-list'),
        import('@editorjs/paragraph'),
        import('@editorjs/quote'),
        import('@editorjs/warning'),
        import('@editorjs/delimiter'),
        import('@editorjs/code'),
        // @ts-ignore
        import('@editorjs/raw'),
        import('@editorjs/table'),
        // @ts-ignore
        import('@editorjs/simple-image'),
        import('@editorjs/image'),
        // @ts-ignore
        import('@editorjs/link'),
        // @ts-ignore
        import('@editorjs/attaches'),
        // @ts-ignore
        import('@editorjs/embed'),
        // @ts-ignore
        import('@editorjs/checklist'),
        // @ts-ignore
        import('@calumk/editorjs-nested-checklist'),
        import('@editorjs/marker'),
        import('@editorjs/inline-code'),
        import('@editorjs/underline'),
        // @ts-ignore
        import('@editorjs/link-autocomplete'),
        // @ts-ignore
        import('@sotaproject/strikethrough'),
        // Temporarily disable text color plugin due to initialization issues
        // // @ts-ignore
        // import('editorjs-text-color-plugin'),
        // @ts-ignore
        import('editorjs-alert'),
        // @ts-ignore
        import('editorjs-toggle-block'),
        // @ts-ignore
        import('editorjs-button'),
        // @ts-ignore
        import('@calumk/editorjs-columns'),
        // @ts-ignore
        import('@editorjs/text-variant-tune'),
        // @ts-ignore
        import('editorjs-drag-drop'),
        // @ts-ignore
        import('editorjs-undo'),
      ]);

      EditorJS = EditorJSModule.default;
      Header = HeaderModule.default;
      List = ListModule.default;
      NestedList = NestedListModule.default;
      Paragraph = ParagraphModule.default;
      Quote = QuoteModule.default;
      Warning = WarningModule.default;
      Delimiter = DelimiterModule.default;
      Code = CodeModule.default;
      Raw = RawModule.default;
      Table = TableModule.default;
      SimpleImage = SimpleImageModule.default;
      Image = ImageModule.default;
      Link = LinkModule.default;
      Attaches = AttachesModule.default;
      Embed = EmbedModule.default;
      Checklist = ChecklistModule.default;
      NestedChecklist = NestedChecklistModule.default;
      Marker = MarkerModule.default;
      InlineCode = InlineCodeModule.default;
      Underline = UnderlineModule.default;
      LinkAutocomplete = LinkAutocompleteModule.default;
      Strikethrough = StrikethroughModule.default;
      // Temporarily disable text color plugin due to initialization issues
      // TextColorPlugin = TextColorPluginModule.default;
      Alert = AlertModule.default;
      ToggleBlock = ToggleBlockModule.default;
      Button = ButtonModule.default;
      Columns = ColumnsModule.default;
      TextVariantTune = TextVariantTuneModule.default;
      DragDrop = DragDropModule.default;
      Undo = UndoModule.default;
    } catch (error) {
      console.warn('Some EditorJS tools failed to load:', error);
      // Initialize core tools at minimum
      const [
        EditorJSModule,
        HeaderModule,
        ListModule,
        ParagraphModule,
        QuoteModule,
        CodeModule,
        MarkerModule,
        InlineCodeModule,
      ] = await Promise.all([
        import('@editorjs/editorjs'),
        import('@editorjs/header'),
        import('@editorjs/list'),
        import('@editorjs/paragraph'),
        import('@editorjs/quote'),
        import('@editorjs/code'),
        import('@editorjs/marker'),
        import('@editorjs/inline-code'),
      ]);

      EditorJS = EditorJSModule.default;
      Header = HeaderModule.default;
      List = ListModule.default;
      Paragraph = ParagraphModule.default;
      Quote = QuoteModule.default;
      Code = CodeModule.default;
      Marker = MarkerModule.default;
      InlineCode = InlineCodeModule.default;
    }
  }
};

interface EditorJSEditorProps {
  data?: OutputData | null; // allow null to defer init
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export interface EditorJSEditorRef {
  save: () => Promise<OutputData>;
  clear: () => void;
}

export const EditorJSEditor = forwardRef<
  EditorJSEditorRef,
  EditorJSEditorProps
>(
  (
    {
      data,
      onChange,
      placeholder = 'Start writing...',
      className,
      readOnly = false,
    },
    ref
  ) => {
    // original refs retained
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const prevDataRef = useRef<string | null>(null);

    const holderId = useRef(`ej-${Math.random().toString(36).slice(2)}`);
    const initDoneRef = useRef(false);
    const destroyingRef = useRef(false);
    const cancelledInitRef = useRef(false);
    const renderQueueRef = useRef(Promise.resolve());

    // Ensure we're on the client side
    useEffect(() => {
      setIsClient(true);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        save: async () =>
          editorRef.current ? await editorRef.current.save() : { blocks: [] },
        clear: () => {
          if (editorRef.current && editorRef.current.clear) {
            editorRef.current.clear();
          }
        },
      }),
      []
    );

    const safeDestroy = async () => {
      if (!editorRef.current || destroyingRef.current) return;
      destroyingRef.current = true;
      try {
        if (editorRef.current.destroy) {
          await editorRef.current.destroy();
        }
      } catch (_) {
        // Handle destroy error silently
      } finally {
        editorRef.current = null;
        initDoneRef.current = false;
        destroyingRef.current = false;
      }
    };

    // One-time initialization effect (cancellable)
    useEffect(() => {
      if (!isClient) return;
      if (!data || typeof data !== 'object') return; // wait until valid data
      if (initDoneRef.current || editorRef.current) return;
      cancelledInitRef.current = false;
      let active = true;

      (async () => {
        try {
          await loadEditorJS();
          if (!active || cancelledInitRef.current || editorRef.current) return;
          const tools: any = {};
          if (Header)
            tools.header = {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            };
          if (Paragraph)
            tools.paragraph = { class: Paragraph, inlineToolbar: true };
          if (List)
            tools.list = {
              class: List,
              inlineToolbar: true,
              config: { defaultStyle: 'unordered' },
            };
          if (Quote)
            tools.quote = {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: "Quote's author",
              },
            };
          if (Code) tools.code = { class: Code };
          if (Marker) tools.marker = { class: Marker };
          if (InlineCode) tools.inlineCode = { class: InlineCode };
          if (Underline) tools.underline = { class: Underline };
          if (Strikethrough) tools.strikethrough = { class: Strikethrough };
          // Temporarily disable TextColorPlugin due to initialization issues
          // if (TextColorPlugin) {
          //   try {
          //     tools.textColor = {
          //       class: TextColorPlugin,
          //       config: {
          //         colorCollections: ['#FF1300','#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39','#FFC107'],
          //         defaultColor: '#FF1300',
          //         type: 'text'
          //       }
          //     };
          //   } catch (e) {
          //     console.warn('Failed to initialize TextColorPlugin:', e);
          //   }
          // }
          if (Checklist)
            tools.checklist = { class: Checklist, inlineToolbar: true };
          if (Table)
            tools.table = {
              class: Table,
              inlineToolbar: true,
              config: { rows: 2, cols: 3 },
            };
          if (Alert)
            tools.alert = {
              class: Alert,
              config: {
                alertTypes: [
                  'primary',
                  'secondary',
                  'info',
                  'success',
                  'warning',
                  'danger',
                  'light',
                  'dark',
                ],
                defaultType: 'primary',
                messagePlaceholder: 'Enter alert message',
              },
            };
          const tunes: string[] = [];
          if (TextVariantTune) {
            tools.textVariant = {
              class: TextVariantTune,
              config: { variants: ['call-out', 'citation', 'details'] },
            };
            tunes.push('textVariant');
          }
          editorRef.current = new EditorJS({
            holder: holderId.current,
            data: data || { blocks: [] },
            readOnly,
            placeholder,
            tools,
            tunes,
            onChange: async () => {
              if (!onChange || !editorRef.current) return;
              try {
                const output = await editorRef.current.save();
                onChange(output);
              } catch (_) {}
            },
            onReady: () => {
              initDoneRef.current = true;
              setIsLoaded(true);
              try {
                prevDataRef.current = JSON.stringify(data || { blocks: [] });
              } catch {
                prevDataRef.current = null;
              }
            },
          });
        } catch (_) {}
      })();

      return () => {
        active = false;
        cancelledInitRef.current = true;
        safeDestroy();
      };
    }, [isClient, data, readOnly, placeholder]);

    // Serialized data updates (avoid concurrent render removeChild issues)
    useEffect(() => {
      if (!initDoneRef.current || !editorRef.current) return;
      if (!data || typeof data !== 'object') return;
      let nextStr = '';
      try {
        nextStr = JSON.stringify(data || { blocks: [] });
      } catch {
        nextStr = '';
      }
      if (prevDataRef.current === nextStr) return;
      prevDataRef.current = nextStr;
      renderQueueRef.current = renderQueueRef.current.then(async () => {
        if (!editorRef.current) return;
        try {
          await editorRef.current.render(data);
        } catch (_) {}
      });
    }, [data]);

    if (!isClient) {
      return (
        <div
          className={`min-h-[200px] rounded-lg border border-gray-200 p-4 ${className}`}
        >
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      );
    }

    return (
      <div
        className={`prose prose-sm min-h-[200px] max-w-none rounded-lg border border-gray-200 p-4 ${className}`}
      >
        <div id={holderId.current} ref={containerRef} />
      </div>
    );
  }
);

EditorJSEditor.displayName = 'EditorJSEditor';

export default EditorJSEditor;
