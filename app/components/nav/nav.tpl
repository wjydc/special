{%function name="nav" data=null themes="default"%}
    {%require name="base:widget/nav/themes/`$themes`.less"%}
    <section class="ve-nav-{%$themes%}">
        <div class="list single">
            {%foreach from=$data key="key" item="item"%}
                {%if is_array($item)%}<a href="{%$item.link%}">{%$item.title%}</a>{%else%}<i>{%$item%}</i>{%/if%}
            {%/foreach%}
        </div>
    </section>
{%/function%}
