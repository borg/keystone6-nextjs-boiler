import React from 'react';
import Link from 'next/link';
import { FieldProps } from '@keystone-6/core/types';
import { css } from '@emotion/css';
import { Button } from '@keystone-ui/button';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { MinusCircleIcon, EditIcon,ArrowDownCircleIcon, ArrowUpCircleIcon } from '@keystone-ui/icons';
import { controller } from '@keystone-6/core/fields/types/json/views';
import { Fragment, useState } from 'react';

interface RelatedLink {
  label: string;
  href: string;
  target:string;
}

const styles = {
  form: {
    field: css`
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
      margin: 1rem 0 0 0;
    `,
    label: css`
      width: 10%;
    `,
    input: css`
      width: 90%;
    `,
    button: css`
      margin: 1rem 0.5rem 0 0;
    `,
  },
  list: {
    ul: css`
      list-style: none;
      margin: 1rem 0 0 0;
      padding: 0;
    `,
    li: css`
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;

      &:nth-of-type(2n) > div:nth-of-type(1) {
        background-color: white;
      }
    `,
    data: css`
      background-color: #eff3f6;
      padding: 0.5rem;
      flex: auto;
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    `,
    dataLabel: css`
      width: 40%;
    `,
    dataHref: css`
      width: 60%;
    `,
    optionButton: css`
      margin: 0 0 0 0.5rem;
    `,
  },
};

export const Field = ({ field, value, onChange, autoFocus }: FieldProps<typeof controller>) => {
  const [labelValue, setLabelValue] = useState('');
  const [hrefValue, setHrefValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [index, setIndex] = useState<number | null>(null);

  const relatedLinks: RelatedLink[] = value ? JSON.parse(value) : [];

  const onSubmitNewRelatedLink = () => {
    if (onChange) {
      const relatedLinksCopy = [...relatedLinks, { label: labelValue, href: hrefValue,target:targetValue }];
      onChange(JSON.stringify(relatedLinksCopy));
      onCancelRelatedLink();
    }
  };

  const onDeleteRelatedLink = (index: number) => {
    if (onChange) {
      const relatedLinksCopy = [...relatedLinks];
      relatedLinksCopy.splice(index, 1);
      onChange(JSON.stringify(relatedLinksCopy));
      onCancelRelatedLink();
    }
  };

  const onEditRelatedLink = (index: number) => {
    if (onChange) {
      setIndex(index);
      setLabelValue(relatedLinks[index].label);
      setHrefValue(relatedLinks[index].href);
      setTargetValue(relatedLinks[index].target);
    }
  };

  const onUpdateRelatedLink = () => {
    if (onChange && index !== null) {
      const relatedLinksCopy = [...relatedLinks];
      relatedLinksCopy[index] = { label: labelValue, href: hrefValue,target:targetValue };
      onChange(JSON.stringify(relatedLinksCopy));
      onCancelRelatedLink();
    }
  };

  const onCancelRelatedLink = () => {
    setIndex(null);
    setLabelValue('');
    setHrefValue('');
  };


  function arraymove(arr:RelatedLink[], fromIndex:number, toIndex:number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}


  const onMoveDown = (index: number) => {
    if (onChange && index<relatedLinks.length-1) {
        const relatedLinksCopy = [...relatedLinks];
        arraymove(relatedLinksCopy,index,index+1);
        onChange(JSON.stringify(relatedLinksCopy));
    }
  };

  const onMoveUp = (index: number) => {
    if (onChange && index>0) {
        const relatedLinksCopy = [...relatedLinks];
        arraymove(relatedLinksCopy,index,index-1);
        onChange(JSON.stringify(relatedLinksCopy));
    }
  };


  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {onChange && (
        <Fragment>
          <div className={styles.form.field}>
            <FieldLabel className={styles.form.label}>Label</FieldLabel>
            <TextInput
              autoFocus={autoFocus}
              onChange={event => setLabelValue(event.target.value)}
              value={labelValue}
              className={styles.form.input}
            />
          </div>
          <div className={styles.form.field}>
            <FieldLabel className={styles.form.label}>Href</FieldLabel>
            <TextInput
              autoFocus={autoFocus}
              onChange={event => setHrefValue(event.target.value)}
              value={hrefValue}
              className={styles.form.input}
            />
          </div>
          <div className={styles.form.field}>
            <FieldLabel className={styles.form.label}>Target</FieldLabel>
            <TextInput
              autoFocus={autoFocus}
              onChange={event => setTargetValue(event.target.value)}
              value={targetValue}
              className={styles.form.input}
            />
          </div>


          {index !== null ? (
            <Fragment>
              <Button onClick={onUpdateRelatedLink} className={styles.form.button}>
                Update
              </Button>
              <Button onClick={onCancelRelatedLink} className={styles.form.button}>
                Cancel
              </Button>
            </Fragment>
          ) : (
            <Button onClick={onSubmitNewRelatedLink} className={styles.form.button}>
              Add
            </Button>
          )}
        </Fragment>
      )}
      <ul className={styles.list.ul}>
        {relatedLinks.map((relatedLink: RelatedLink, i: number) => {
          return (
            <li key={`related-link-${i}`} className={styles.list.li}>
              <div className={styles.list.data}>
                <div className={styles.list.dataLabel}>{relatedLink.label}</div>
                <div className={styles.list.dataHref}>
                  <Link href={relatedLink.href} target="_blank">
                    {relatedLink.href}
                  </Link>
                </div>
                <div className={styles.list.dataLabel}>
                {relatedLink.target}
                </div>
              </div>
              {onChange && (
                <div>
                    <Button size="small" className={styles.list.optionButton}>
                    <ArrowDownCircleIcon
                      size="small"
                      color="gray"
                      onClick={() => onMoveDown(i)}
                    />
                  </Button>
                  <Button size="small" className={styles.list.optionButton}>
                    <ArrowUpCircleIcon
                      size="small"
                      color="gray"
                      onClick={() => onMoveUp(i)}
                    />
                  </Button>

                  <Button
                    size="small"
                    onClick={() => onEditRelatedLink(i)}
                    className={styles.list.optionButton}
                  >
                    <EditIcon size="small" color="gray" />
                  </Button>
                  <Button size="small" className={styles.list.optionButton}>
                    <MinusCircleIcon
                      size="small"
                      color="red"
                      onClick={() => onDeleteRelatedLink(i)}
                    />
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </FieldContainer>
  );
};