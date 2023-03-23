# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Open Podcast API specification'
copyright = '2023, Open Podcast API team'
author = 'Open Podcast API team'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
   "myst_parser",
   "sphinx_design",
   "sphinx_copybutton",
   "sphinxcontrib.mermaid",
   "sphinx_external_toc"
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store', '.venv']
root_doc = "index"

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'furo'
html_static_path = ['_static']

html_theme_options = {
    "source_repository": "https://github.com/OpenPodcastAPI/api-specs",
    "source_branch": "main",
    "source_directory": "docs/",
}

# -- Options for MyST -------------------------

myst_enable_extensions = [
   "colon_fence",
   "substitution",
   "tasklist",
   "deflist",
   "fieldlist",
   "attrs_inline",
   "attrs_block",
]

myst_heading_anchors = 3
myst_enable_checkboxes = True
mermaid_theme = "neutral"
