declare interface IHtmlBlockWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'HtmlBlockWebPartStrings' {
  const strings: IHtmlBlockWebPartStrings;
  export = strings;
}
