/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Installateur graphique de Halo (WPF, .NET Framework 4.x : présent sur tout Windows 10/11).
// Compilé par scripts/installer/build.mjs avec le compilateur C# livré avec Windows (C# 5).
// Les fichiers de Halo (patcher.js, preload.js, renderer.js, renderer.css) sont embarqués en ressources.
//
// Ligne de commande (sans fenêtre) : --install | --uninstall | --status
//   [--branch stable|ptb|canary] [--no-relaunch] [--log fichier]

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using IOPath = System.IO.Path;

[assembly: AssemblyTitle("Halo Installer")]
[assembly: AssemblyProduct("Halo")]
[assembly: AssemblyDescription("Installe Halo dans Discord")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]

namespace Halo
{
    class VersionDir
    {
        public string Version;
        public string Resources;
    }

    class Install
    {
        public string Branch;
        public string Label;
        public string Exe;
        public string Root;
        public List<VersionDir> Versions;
        public VersionDir Latest;
        public string State;
    }

    static class Text
    {
        static readonly bool French = System.Globalization.CultureInfo.CurrentUICulture.TwoLetterISOLanguageName == "fr";

        static readonly Dictionary<string, string[]> Strings = new Dictionary<string, string[]>
        {
            { "tagline", new[] { "Plugins, thèmes et performances pour Discord", "Plugins, themes and performance for Discord" } },
            { "detected", new[] { "INSTALLATIONS DE DISCORD", "DISCORD INSTALLATIONS" } },
            { "none", new[] { "Aucune installation de Discord trouvée. Installez Discord depuis discord.com, puis relancez cet installateur.", "No Discord installation found. Install Discord from discord.com, then run this installer again." } },
            { "version", new[] { "Version {0}", "Version {0}" } },
            { "state.halo", new[] { "Halo installé", "Halo installed" } },
            { "state.vanilla", new[] { "Non modifié", "Not modified" } },
            { "state.othermod", new[] { "Autre mod détecté", "Another mod detected" } },
            { "state.missing", new[] { "Fichier d'origine manquant", "Original file missing" } },
            { "state.unknown", new[] { "État inconnu", "Unknown state" } },
            { "install", new[] { "Installer / Réparer", "Install / Repair" } },
            { "uninstall", new[] { "Désinstaller", "Uninstall" } },
            { "relaunch", new[] { "Relancer Discord à la fin", "Relaunch Discord when done" } },
            { "ready", new[] { "Prêt. Discord sera fermé pendant l'opération.", "Ready. Discord will be closed during the operation." } },
            { "closing", new[] { "Fermeture de Discord…", "Closing Discord…" } },
            { "copying", new[] { "Copie des fichiers de Halo…", "Copying Halo files…" } },
            { "patching", new[] { "Installation dans {0}…", "Installing into {0}…" } },
            { "restoring", new[] { "Restauration de {0}…", "Restoring {0}…" } },
            { "done.install", new[] { "Halo est installé. Ouvrez Discord → Paramètres → Halo.", "Halo is installed. Open Discord → Settings → Halo." } },
            { "done.uninstall", new[] { "Halo est désinstallé. Discord a retrouvé ses fichiers d'origine.", "Halo is uninstalled. Discord is back to its original files." } },
            { "nothing", new[] { "Cochez au moins une installation.", "Select at least one installation." } },
            { "error", new[] { "Erreur : {0}", "Error: {0}" } },
            { "err.othermod", new[] { "un autre mod est installé, désinstallez-le d'abord", "another mod is installed, uninstall it first" } },
            { "err.missing", new[] { "le fichier d'origine de Discord est introuvable, réinstallez Discord depuis discord.com", "Discord's original file is missing, reinstall Discord from discord.com" } },
            { "warning", new[] { "Modifier le client Discord est contraire à ses conditions d'utilisation. Vous utilisez Halo à vos risques.", "Modifying the Discord client is against its terms of service. You use Halo at your own risk." } }
        };

        public static string T(string key, params object[] args)
        {
            string[] pair;
            string value = Strings.TryGetValue(key, out pair) ? pair[French ? 0 : 1] : key;
            return args.Length > 0 ? string.Format(value, args) : value;
        }
    }

    static class Core
    {
        public const string AppVersion = "1.0.0";
        const string Marker = "HALO_STUB";
        const long MinOriginalSize = 512 * 1024;
        static readonly string[] DistFiles = { "patcher.js", "preload.js", "renderer.js", "renderer.css" };

        static readonly string[][] Branches =
        {
            new[] { "stable", "Discord", "Discord", "Discord.exe" },
            new[] { "ptb", "Discord PTB", "DiscordPTB", "DiscordPTB.exe" },
            new[] { "canary", "Discord Canary", "DiscordCanary", "DiscordCanary.exe" }
        };

        static string Env(string name, Environment.SpecialFolder fallback)
        {
            string value = Environment.GetEnvironmentVariable(name);
            return string.IsNullOrEmpty(value) ? Environment.GetFolderPath(fallback) : value;
        }

        public static string HaloDir { get { return IOPath.Combine(Env("APPDATA", Environment.SpecialFolder.ApplicationData), "Halo"); } }
        static string DistDir { get { return IOPath.Combine(HaloDir, "dist"); } }

        static Version ParseVersion(string v)
        {
            Version parsed;
            return System.Version.TryParse(v, out parsed) ? parsed : new Version(0, 0);
        }

        public static List<Install> FindInstalls()
        {
            var installs = new List<Install>();
            string local = Env("LOCALAPPDATA", Environment.SpecialFolder.LocalApplicationData);

            foreach (var b in Branches)
            {
                string root = IOPath.Combine(local, b[2]);
                if (!Directory.Exists(root)) continue;

                var versions = Directory.GetDirectories(root, "app-*")
                    .Select(d => new VersionDir { Version = IOPath.GetFileName(d).Substring(4), Resources = IOPath.Combine(d, "resources") })
                    .Where(v => Directory.Exists(v.Resources))
                    .OrderByDescending(v => ParseVersion(v.Version))
                    .ToList();
                if (versions.Count == 0) continue;

                installs.Add(new Install
                {
                    Branch = b[0],
                    Label = b[1],
                    Exe = b[3],
                    Root = root,
                    Versions = versions,
                    Latest = versions[0],
                    State = GetState(versions[0].Resources)
                });
            }
            return installs;
        }

        static string ReadHead(string file)
        {
            try
            {
                using (var stream = File.OpenRead(file))
                {
                    var buffer = new byte[8192];
                    int read = stream.Read(buffer, 0, buffer.Length);
                    return Encoding.GetEncoding(28591).GetString(buffer, 0, read);
                }
            }
            catch { return ""; }
        }

        // Le vrai app.asar de Discord pèse plusieurs Mo ; les relais des mods quelques Ko.
        static bool IsOriginal(string file)
        {
            try { return new FileInfo(file).Length >= MinOriginalSize && !ReadHead(file).Contains("_STUB"); }
            catch { return false; }
        }

        // halo | vanilla | othermod | missing | unknown
        public static string GetState(string resources)
        {
            string asar = IOPath.Combine(resources, "app.asar");
            string backup = IOPath.Combine(resources, "_app.asar");
            bool hasAsar = File.Exists(asar), hasBackup = File.Exists(backup);

            // Jamais d'écriture si le fichier d'origine de Discord n'est plus là
            if (hasBackup && !IsOriginal(backup)) return "missing";
            if (!hasBackup && hasAsar && !IsOriginal(asar)) return "missing";

            if (File.Exists(IOPath.Combine(resources, "app", "index.js"))) return "othermod";
            if (hasAsar && hasBackup) return ReadHead(asar).Contains(Marker) ? "halo" : "othermod";
            if (hasAsar) return "vanilla";
            return "unknown";
        }

        // Format asar : [taille de l'en-tête] [en-tête JSON] [contenu des fichiers], entiers 32 bits little-endian
        static byte[] CreateAsar(string[] names, string[] contents)
        {
            var blobs = new List<byte[]>();
            var json = new StringBuilder("{\"files\":{");
            long offset = 0;
            for (int i = 0; i < names.Length; i++)
            {
                byte[] blob = Encoding.UTF8.GetBytes(contents[i]);
                if (i > 0) json.Append(',');
                json.Append('"').Append(names[i]).Append("\":{\"size\":").Append(blob.Length).Append(",\"offset\":\"").Append(offset).Append("\"}");
                offset += blob.Length;
                blobs.Add(blob);
            }
            json.Append("}}");

            byte[] header = Encoding.UTF8.GetBytes(json.ToString());
            int padded = (header.Length + 3) / 4 * 4;

            using (var output = new MemoryStream())
            using (var writer = new BinaryWriter(output))
            {
                writer.Write((uint)4);
                writer.Write((uint)(8 + padded));
                writer.Write((uint)(4 + padded));
                writer.Write((uint)header.Length);
                writer.Write(header);
                writer.Write(new byte[padded - header.Length]);
                foreach (var blob in blobs) writer.Write(blob);
                writer.Flush();
                return output.ToArray();
            }
        }

        static byte[] StubAsar(string patcherPath)
        {
            string escaped = patcherPath.Replace("\\", "\\\\").Replace("\"", "\\\"");
            string index =
                "// " + Marker + " : généré par l'installateur Halo\n" +
                "\"use strict\";\n" +
                "try {\n" +
                "    require(\"" + escaped + "\");\n" +
                "} catch (err) {\n" +
                "    // Halo absent ou en erreur : Discord démarre normalement\n" +
                "    console.error(\"[Halo] Chargement impossible, démarrage de Discord sans Halo :\", err);\n" +
                "    const path = require(\"path\");\n" +
                "    const asar = path.join(__dirname, \"..\", \"_app.asar\");\n" +
                "    const pkg = require(path.join(asar, \"package.json\"));\n" +
                "    require(\"electron\").app.setAppPath(asar);\n" +
                "    require.main.filename = path.join(asar, pkg.main);\n" +
                "    require(require.main.filename);\n" +
                "}\n";
            return CreateAsar(new[] { "index.js", "package.json" }, new[] { index, "{\"name\":\"discord\",\"main\":\"index.js\"}" });
        }

        public static string CopyDist()
        {
            Directory.CreateDirectory(DistDir);
            var assembly = Assembly.GetExecutingAssembly();
            foreach (string name in DistFiles)
            {
                using (var input = assembly.GetManifestResourceStream(name))
                {
                    if (input == null) throw new InvalidOperationException("ressource manquante : " + name);
                    using (var output = File.Create(IOPath.Combine(DistDir, name))) input.CopyTo(output);
                }
            }
            return IOPath.Combine(DistDir, "patcher.js");
        }

        public static void Patch(string resources, string patcherPath)
        {
            string state = GetState(resources);
            if (state == "missing") throw new InvalidOperationException(Text.T("err.missing"));
            if (state == "othermod") throw new InvalidOperationException(Text.T("err.othermod"));
            if (state == "unknown") throw new FileNotFoundException("app.asar", resources);

            string asar = IOPath.Combine(resources, "app.asar");
            if (state == "vanilla") File.Move(asar, IOPath.Combine(resources, "_app.asar"));
            File.WriteAllBytes(asar, StubAsar(patcherPath));
        }

        public static bool Unpatch(string resources)
        {
            if (GetState(resources) != "halo") return false;
            string asar = IOPath.Combine(resources, "app.asar");
            File.Delete(asar);
            File.Move(IOPath.Combine(resources, "_app.asar"), asar);
            return true;
        }

        public static void CloseDiscord(Install install)
        {
            // Uniquement les processus lancés depuis ce dossier d'installation
            var processes = Process.GetProcessesByName(IOPath.GetFileNameWithoutExtension(install.Exe))
                .Where(p =>
                {
                    try { return p.MainModule.FileName.StartsWith(install.Root, StringComparison.OrdinalIgnoreCase); }
                    catch { return false; }
                })
                .ToArray();
            if (processes.Length == 0) return;
            foreach (var p in processes)
            {
                try { p.Kill(); } catch { }
            }
            foreach (var p in processes)
            {
                try { p.WaitForExit(5000); } catch { }
            }
            Thread.Sleep(1200);
        }

        public static void Relaunch(Install install)
        {
            string updater = IOPath.Combine(install.Root, "Update.exe");
            if (!File.Exists(updater)) return;
            Process.Start(new ProcessStartInfo(updater, "--processStart " + install.Exe) { UseShellExecute = false });
        }

        /// <summary>Exécute une installation ou une désinstallation. Renvoie null en cas de succès, sinon le message d'erreur.</summary>
        public static string Run(bool install, List<Install> targets, bool relaunch, Action<string> progress)
        {
            try
            {
                progress(Text.T("closing"));
                foreach (var target in targets) CloseDiscord(target);

                if (install)
                {
                    progress(Text.T("copying"));
                    string patcher = CopyDist();
                    foreach (var target in targets)
                    {
                        progress(Text.T("patching", target.Label));
                        Patch(target.Latest.Resources, patcher);
                    }
                }
                else
                {
                    foreach (var target in targets)
                    {
                        progress(Text.T("restoring", target.Label));
                        foreach (var version in target.Versions) Unpatch(version.Resources);
                    }
                }

                if (relaunch)
                    foreach (var target in targets) Relaunch(target);
                return null;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }

    class MainWindow : Window
    {
        static readonly Color Blurple = (Color)ColorConverter.ConvertFromString("#5865F2");
        static SolidColorBrush Brush(string hex) { return new SolidColorBrush((Color)ColorConverter.ConvertFromString(hex)); }

        const string ButtonStyle =
            "<Style xmlns='http://schemas.microsoft.com/winfx/2006/xaml/presentation' xmlns:x='http://schemas.microsoft.com/winfx/2006/xaml' TargetType='Button'>" +
            "<Setter Property='Foreground' Value='White'/><Setter Property='FontSize' Value='14'/><Setter Property='FontWeight' Value='SemiBold'/>" +
            "<Setter Property='Cursor' Value='Hand'/><Setter Property='Padding' Value='20,11'/><Setter Property='Background' Value='#5865F2'/>" +
            "<Setter Property='Template'><Setter.Value><ControlTemplate TargetType='Button'>" +
            "<Border x:Name='b' Background='{TemplateBinding Background}' CornerRadius='10' Padding='{TemplateBinding Padding}'>" +
            "<ContentPresenter HorizontalAlignment='Center' VerticalAlignment='Center'/></Border>" +
            "<ControlTemplate.Triggers>" +
            "<Trigger Property='IsMouseOver' Value='True'><Setter TargetName='b' Property='Opacity' Value='0.86'/></Trigger>" +
            "<Trigger Property='IsPressed' Value='True'><Setter TargetName='b' Property='Opacity' Value='0.72'/></Trigger>" +
            "<Trigger Property='IsEnabled' Value='False'><Setter TargetName='b' Property='Opacity' Value='0.4'/></Trigger>" +
            "</ControlTemplate.Triggers></ControlTemplate></Setter.Value></Setter></Style>";

        const string CheckStyle =
            "<Style xmlns='http://schemas.microsoft.com/winfx/2006/xaml/presentation' xmlns:x='http://schemas.microsoft.com/winfx/2006/xaml' TargetType='CheckBox'>" +
            "<Setter Property='Foreground' Value='#DBDEE1'/><Setter Property='FontSize' Value='13.5'/><Setter Property='Cursor' Value='Hand'/>" +
            "<Setter Property='Template'><Setter.Value><ControlTemplate TargetType='CheckBox'>" +
            "<StackPanel Orientation='Horizontal' Background='Transparent'>" +
            "<Border x:Name='box' Width='22' Height='22' CornerRadius='7' BorderThickness='2' BorderBrush='#80848E' Background='Transparent' VerticalAlignment='Center'>" +
            "<Path x:Name='mark' Data='M4,9 L8,13 L14,5' Stroke='White' StrokeThickness='2.4' StrokeStartLineCap='Round' StrokeEndLineCap='Round' StrokeLineJoin='Round' Visibility='Collapsed'/>" +
            "</Border><ContentPresenter Margin='10,0,0,0' VerticalAlignment='Center'/></StackPanel>" +
            "<ControlTemplate.Triggers>" +
            "<Trigger Property='IsChecked' Value='True'><Setter TargetName='box' Property='Background' Value='#5865F2'/><Setter TargetName='box' Property='BorderBrush' Value='#5865F2'/><Setter TargetName='mark' Property='Visibility' Value='Visible'/></Trigger>" +
            "<Trigger Property='IsEnabled' Value='False'><Setter Property='Opacity' Value='0.45'/></Trigger>" +
            "</ControlTemplate.Triggers></ControlTemplate></Setter.Value></Setter></Style>";

        readonly Style buttonStyle = (Style)XamlReader.Parse(ButtonStyle);
        readonly Style checkStyle = (Style)XamlReader.Parse(CheckStyle);

        readonly StackPanel installList = new StackPanel();
        readonly TextBlock status = new TextBlock();
        readonly ProgressBar progress = new ProgressBar();
        readonly CheckBox relaunch = new CheckBox();
        readonly Dictionary<Install, CheckBox> selection = new Dictionary<Install, CheckBox>();
        Button installButton, uninstallButton;
        public Border Shell;

        public MainWindow()
        {
            Title = "Halo";
            Width = 760;
            SizeToContent = SizeToContent.Height;
            WindowStyle = WindowStyle.None;
            AllowsTransparency = true;
            Background = Brushes.Transparent;
            ResizeMode = ResizeMode.CanMinimize;
            WindowStartupLocation = WindowStartupLocation.CenterScreen;
            FontFamily = new FontFamily("Segoe UI");
            UseLayoutRounding = true;
            TextOptions.SetTextFormattingMode(this, TextFormattingMode.Display);

            Shell = new Border
            {
                CornerRadius = new CornerRadius(18),
                Background = Brush("#1E1F22"),
                Margin = new Thickness(22),
                Effect = new DropShadowEffect { BlurRadius = 30, ShadowDepth = 6, Opacity = 0.5, Color = Colors.Black }
            };

            var layout = new StackPanel();
            layout.Children.Add(BuildHeader());
            layout.Children.Add(BuildBody());
            Shell.Child = layout;
            Content = Shell;

            RefreshInstalls();
            SetStatus(Text.T("ready"), "#B5BAC1");
        }

        UIElement BuildHeader()
        {
            const double width = 760 - 44;
            var header = new Grid { Height = 156, ClipToBounds = true, Clip = new RectangleGeometry(new Rect(0, 0, width, 200), 18, 18) };
            header.MouseLeftButtonDown += delegate { try { DragMove(); } catch { } };

            var gradient = new LinearGradientBrush { StartPoint = new Point(0, 0), EndPoint = new Point(1, 1) };
            gradient.GradientStops.Add(new GradientStop((Color)ColorConverter.ConvertFromString("#6A76FF"), 0));
            gradient.GradientStops.Add(new GradientStop(Blurple, 0.45));
            gradient.GradientStops.Add(new GradientStop((Color)ColorConverter.ConvertFromString("#3C45A5"), 1));
            header.Children.Add(new Border { Background = gradient });

            // Grands anneaux décoratifs
            header.Children.Add(new System.Windows.Shapes.Ellipse
            {
                Width = 300, Height = 300, StrokeThickness = 26, Stroke = new SolidColorBrush(Color.FromArgb(28, 255, 255, 255)),
                HorizontalAlignment = HorizontalAlignment.Right, VerticalAlignment = VerticalAlignment.Top, Margin = new Thickness(0, -110, -70, 0)
            });
            header.Children.Add(new System.Windows.Shapes.Ellipse
            {
                Width = 150, Height = 150, StrokeThickness = 10, Stroke = new SolidColorBrush(Color.FromArgb(22, 255, 255, 255)),
                HorizontalAlignment = HorizontalAlignment.Right, VerticalAlignment = VerticalAlignment.Bottom, Margin = new Thickness(0, 0, 190, -70)
            });

            var brand = new StackPanel { Orientation = Orientation.Horizontal, VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(32, 0, 0, 0) };
            var logo = new Grid { Width = 76, Height = 76 };
            logo.Children.Add(new System.Windows.Shapes.Ellipse { Fill = new SolidColorBrush(Color.FromArgb(40, 255, 255, 255)) });
            logo.Children.Add(new System.Windows.Shapes.Ellipse
            {
                Width = 44, Height = 44, StrokeThickness = 9, Stroke = Brushes.White,
                Effect = new DropShadowEffect { BlurRadius = 18, ShadowDepth = 0, Color = Colors.White, Opacity = 0.9 }
            });
            brand.Children.Add(logo);

            var titles = new StackPanel { Margin = new Thickness(20, 0, 0, 0), VerticalAlignment = VerticalAlignment.Center };
            titles.Children.Add(new TextBlock { Text = "Halo", FontSize = 40, FontWeight = FontWeights.Bold, Foreground = Brushes.White });
            titles.Children.Add(new TextBlock { Text = Text.T("tagline"), FontSize = 14.5, Foreground = new SolidColorBrush(Color.FromArgb(230, 255, 255, 255)), Margin = new Thickness(2, 2, 0, 0) });
            brand.Children.Add(titles);
            header.Children.Add(brand);

            var controls = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Right, VerticalAlignment = VerticalAlignment.Top, Margin = new Thickness(0, 12, 12, 0) };
            controls.Children.Add(WindowButton("—", delegate { WindowState = WindowState.Minimized; }));
            controls.Children.Add(WindowButton("✕", delegate { Close(); }));
            header.Children.Add(controls);
            return header;
        }

        Button WindowButton(string glyph, RoutedEventHandler onClick)
        {
            var button = new Button
            {
                Content = glyph, Style = buttonStyle, Background = new SolidColorBrush(Color.FromArgb(40, 0, 0, 0)),
                Padding = new Thickness(0), Width = 34, Height = 30, FontSize = 12, Margin = new Thickness(6, 0, 0, 0)
            };
            button.Click += onClick;
            return button;
        }

        UIElement BuildBody()
        {
            var body = new StackPanel { Margin = new Thickness(28, 22, 28, 22) };
            body.Children.Add(new TextBlock { Text = Text.T("detected"), FontSize = 11.5, FontWeight = FontWeights.Bold, Foreground = Brush("#949BA4"), Margin = new Thickness(2, 0, 0, 10) });
            body.Children.Add(installList);

            relaunch.Style = checkStyle;
            relaunch.Content = Text.T("relaunch");
            relaunch.IsChecked = true;

            installButton = new Button { Content = Text.T("install"), Style = buttonStyle };
            installButton.Click += delegate { Start(true); };
            uninstallButton = new Button { Content = Text.T("uninstall"), Style = buttonStyle, Background = Brush("#383A40"), Margin = new Thickness(0, 0, 10, 0) };
            uninstallButton.Click += delegate { Start(false); };

            var actions = new DockPanel { Margin = new Thickness(0, 14, 0, 0), LastChildFill = false };
            DockPanel.SetDock(relaunch, Dock.Left);
            actions.Children.Add(relaunch);
            DockPanel.SetDock(installButton, Dock.Right);
            actions.Children.Add(installButton);
            DockPanel.SetDock(uninstallButton, Dock.Right);
            actions.Children.Add(uninstallButton);
            body.Children.Add(actions);

            progress.Height = 4;
            progress.BorderThickness = new Thickness(0);
            progress.Background = Brush("#2B2D31");
            progress.Foreground = new SolidColorBrush(Blurple);
            progress.Margin = new Thickness(0, 20, 0, 10);
            body.Children.Add(progress);

            status.FontSize = 13.5;
            status.TextWrapping = TextWrapping.Wrap;
            body.Children.Add(status);

            body.Children.Add(new Border { Height = 1, Background = Brush("#2E3035"), Margin = new Thickness(0, 18, 0, 14) });
            var footer = new DockPanel { LastChildFill = true };
            var version = new TextBlock { Text = "v" + Core.AppVersion, FontSize = 11.5, Foreground = Brush("#6D717A"), VerticalAlignment = VerticalAlignment.Bottom, Margin = new Thickness(12, 0, 0, 0) };
            DockPanel.SetDock(version, Dock.Right);
            footer.Children.Add(version);
            footer.Children.Add(new TextBlock { Text = Text.T("warning"), FontSize = 11.5, Foreground = Brush("#80848E"), TextWrapping = TextWrapping.Wrap });
            body.Children.Add(footer);
            return body;
        }

        void RefreshInstalls()
        {
            installList.Children.Clear();
            selection.Clear();
            var installs = Core.FindInstalls();

            if (installs.Count == 0)
            {
                installList.Children.Add(new Border
                {
                    Background = Brush("#2B2D31"), CornerRadius = new CornerRadius(12), Padding = new Thickness(18),
                    Child = new TextBlock { Text = Text.T("none"), Foreground = Brush("#DBDEE1"), FontSize = 13.5, TextWrapping = TextWrapping.Wrap }
                });
            }

            foreach (var install in installs)
            {
                bool usable = install.State == "halo" || install.State == "vanilla";
                var check = new CheckBox { Style = checkStyle, IsChecked = usable, IsEnabled = usable, VerticalAlignment = VerticalAlignment.Center };
                selection[install] = check;

                var names = new StackPanel { Margin = new Thickness(14, 0, 0, 0), VerticalAlignment = VerticalAlignment.Center };
                names.Children.Add(new TextBlock { Text = install.Label, FontSize = 15.5, FontWeight = FontWeights.SemiBold, Foreground = Brush("#F2F3F5") });
                names.Children.Add(new TextBlock { Text = Text.T("version", install.Latest.Version), FontSize = 12.5, Foreground = Brush("#949BA4"), Margin = new Thickness(0, 2, 0, 0) });

                string color = install.State == "halo" ? "#23A55A" : install.State == "vanilla" ? "#B5BAC1" : install.State == "othermod" ? "#F0B232" : "#F23F43";
                var tint = (Color)ColorConverter.ConvertFromString(color);
                var pill = new Border
                {
                    CornerRadius = new CornerRadius(11), Padding = new Thickness(12, 5, 12, 5), VerticalAlignment = VerticalAlignment.Center,
                    Background = new SolidColorBrush(Color.FromArgb(38, tint.R, tint.G, tint.B)),
                    Child = new TextBlock { Text = Text.T("state." + install.State), FontSize = 12, FontWeight = FontWeights.SemiBold, Foreground = new SolidColorBrush(tint) }
                };

                var row = new DockPanel { LastChildFill = true };
                DockPanel.SetDock(check, Dock.Left);
                row.Children.Add(check);
                DockPanel.SetDock(pill, Dock.Right);
                row.Children.Add(pill);
                row.Children.Add(names);

                installList.Children.Add(new Border
                {
                    Background = Brush("#2B2D31"), CornerRadius = new CornerRadius(12), Padding = new Thickness(16, 13, 16, 13),
                    Margin = new Thickness(0, 0, 0, 8), BorderThickness = new Thickness(1), BorderBrush = Brush("#34363C"), Child = row
                });
            }

            bool any = installs.Any(i => i.State == "halo" || i.State == "vanilla");
            if (installButton != null)
            {
                installButton.IsEnabled = any;
                uninstallButton.IsEnabled = installs.Any(i => i.State == "halo");
            }
        }

        void SetStatus(string text, string color)
        {
            status.Text = text;
            status.Foreground = Brush(color);
        }

        void Start(bool install)
        {
            var targets = selection.Where(p => p.Value.IsChecked == true && p.Value.IsEnabled).Select(p => p.Key).ToList();
            if (!install) targets = targets.Where(t => t.State == "halo").ToList();
            if (targets.Count == 0)
            {
                SetStatus(Text.T("nothing"), "#F0B232");
                return;
            }

            bool restart = relaunch.IsChecked == true;
            installButton.IsEnabled = uninstallButton.IsEnabled = false;
            progress.IsIndeterminate = true;

            Task.Factory.StartNew(() => Core.Run(install, targets, restart, message =>
                Dispatcher.Invoke(new Action(() => SetStatus(message, "#DBDEE1")))))
            .ContinueWith(task => Dispatcher.Invoke(new Action(() =>
            {
                progress.IsIndeterminate = false;
                progress.Value = task.Result == null ? 100 : 0;
                RefreshInstalls();
                if (task.Result == null) SetStatus(Text.T(install ? "done.install" : "done.uninstall"), "#23A55A");
                else SetStatus(Text.T("error", task.Result), "#F23F43");
            })));
        }

        /// <summary>Enregistre une capture de la fenêtre (utilisé pour vérifier le rendu sans l'afficher).</summary>
        public void SaveScreenshot(string file)
        {
            var bitmap = new RenderTargetBitmap((int)ActualWidth, (int)ActualHeight, 96, 96, PixelFormats.Pbgra32);
            bitmap.Render(this);
            var encoder = new PngBitmapEncoder();
            encoder.Frames.Add(BitmapFrame.Create(bitmap));
            using (var stream = File.Create(file)) encoder.Save(stream);
        }
    }

    static class Program
    {
        static string Option(string[] args, string name)
        {
            int i = Array.IndexOf(args, name);
            return i >= 0 && i + 1 < args.Length ? args[i + 1] : null;
        }

        [STAThread]
        static int Main(string[] args)
        {
            string logFile = Option(args, "--log");
            Action<string> log = line => { if (logFile != null) File.AppendAllText(logFile, line + Environment.NewLine, Encoding.UTF8); };

            bool install = args.Contains("--install"), uninstall = args.Contains("--uninstall");
            if (install || uninstall || args.Contains("--status"))
            {
                string branch = Option(args, "--branch");
                var installs = Core.FindInstalls().Where(i => branch == null || i.Branch == branch).ToList();

                string error = null;
                if (install || uninstall)
                {
                    var targets = installs.Where(i => install ? i.State == "halo" || i.State == "vanilla" : i.State == "halo").ToList();
                    foreach (var blocked in installs.Except(targets)) log(blocked.Label + " : " + Text.T("state." + blocked.State));
                    error = Core.Run(install, targets, !args.Contains("--no-relaunch"), log);
                    if (error != null) log(Text.T("error", error));
                }

                foreach (var i in Core.FindInstalls()) log(i.Label + " " + i.Latest.Version + " : " + i.State);
                return error == null ? 0 : 1;
            }

            var app = new Application();
            var window = new MainWindow();

            string screenshot = Option(args, "--screenshot");
            if (screenshot != null)
            {
                window.WindowStartupLocation = WindowStartupLocation.Manual;
                window.Left = -5000;
                window.ShowInTaskbar = false;
                window.ContentRendered += delegate
                {
                    window.SaveScreenshot(screenshot);
                    window.Close();
                };
            }

            app.Run(window);
            return 0;
        }
    }
}
